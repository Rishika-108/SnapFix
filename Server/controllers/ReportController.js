import { v2 as cloudinary } from 'cloudinary'
import Report from "../models/reportModel.js";
import User from "../models/userModel.js";
import fs from "fs";
import axios from "axios";
import { createNotification } from "./notificationController.js";
import FormData from 'form-data';

const calculateCosineSimilarity = (vec1, vec2) => {
    if (!vec1 || !vec2 || vec1.length === 0 || vec1.length !== vec2.length) return 0;
    let dotProduct = 0;
    for (let i = 0; i < vec1.length; i++) {
        dotProduct += vec1[i] * vec2[i];
    }
    return dotProduct;
};

//create a new report
const createReport = async (req, res) => {
    try {
        const { title, description, category, latitude, longitude } = req.body;
        // AI Logic for checking duplicate and classifying issue
        if (latitude == null || longitude == null) {
            return res.status(400).json({ success: false, message: "Location is missing" })
        }

        const userId = req.user?._id
        let cloudinaryResult;

        try {
            cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "reports_uploads",
            });

            // --- AI ENGINE INTEGRATION ---
            let aiResult = null;
            try {
                const formData = new FormData();
                formData.append('file', fs.createReadStream(req.file.path));

                // Handle potential trailing slash in AI_SERVER_URL
                const baseUrl = process.env.AI_SERVER_URL.endsWith('/') 
                    ? process.env.AI_SERVER_URL.slice(0, -1) 
                    : process.env.AI_SERVER_URL;

                const aiResponse = await axios.post(`${baseUrl}/get_embedding`, formData, {
                    headers: { ...formData.getHeaders() }
                });
                aiResult = aiResponse.data; // { embedding, is_valid, confidence }
            } catch (aiError) {
                console.error("AI Engine Error:", aiError.message);
                // Fallback: Proceed with basic checks if AI is down
            }

            // Handle AI Rejection based on confidence threshold
            const CONFIDENCE_THRESHOLD = 0.5; 
            if (aiResult && (!aiResult.is_valid || aiResult.confidence < CONFIDENCE_THRESHOLD)) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Our AI system flagged this image as a non-civic issue or is not confident enough (Confidence: ${(aiResult.confidence * 100).toFixed(1)}%). Please upload a relevant and clear photo of a civic problem.`,
                    aiDetail: aiResult
                });
            }

            // Handle duplicates - Check Mongo for nearby reports and compare embeddings
            const nearbyReports = await Report.find({
                status: { $in: ['Pending', 'In Progress'] },
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
                        $maxDistance: 50 // 50 meters
                    }
                }
            }).limit(10);

            let duplicateReport = null;
            if (aiResult && aiResult.embedding) {
                for (const r of nearbyReports) {
                    const similarity = calculateCosineSimilarity(aiResult.embedding, r.embedding);
                    if (similarity > 0.9) { // 90% similarity threshold for CLIP embeddings
                        duplicateReport = r;
                        break;
                    }
                }
            } else {
                // Fallback to category/distance if no AI result
                duplicateReport = nearbyReports.find(r => r.category === category);
            }

            if (duplicateReport) {
                // Auto-upvote the existing report instead of creating a new one
                const alreadyUpvoted = duplicateReport.upvotedUsers.some(
                    (uid) => uid.toString() === userId?.toString()
                );

                if (!alreadyUpvoted && userId) {
                    duplicateReport.upvotedUsers.push(userId);
                    duplicateReport.upvotes = duplicateReport.upvotedUsers.length;
                    await duplicateReport.save();
                    
                    await createNotification(userId, "User", "Duplicate Issue Detected", `A similar issue in the category "${duplicateReport.category}" was already reported nearby. We've automatically added your upvote to the existing report to increase its priority!`);
                }

                return res.status(200).json({ 
                    success: true, 
                    message: "A similar issue is already reported. Your upvote has been added to it.",
                    report: duplicateReport,
                    isDuplicate: true
                });
            }

            // --- SUSTAINABLE TRANSLATION LOGIC ---
            // In a real production app, you would call a translation API here (e.g., Google, DeepL, or your own AI).
            // For this hackathon, we initialize both to the input, but provide the structure for auto-translation.
            const localizedContent = {
                en: { title, description },
                hi: { title, description } // Placeholder for auto-translated Hindi
            };

            const report = await Report.create({
                title, 
                description, 
                imageUrl: cloudinaryResult.secure_url, 
                category: category, // Keep user category or use AI if implemented later
                createdBy: userId || null,
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                },
                priority: 'Low', // AI doesn't return priority in this version
                aiConfidence: aiResult ? aiResult.confidence : 0,
                embedding: aiResult ? aiResult.embedding : [],
                localizedContent
            })

            if (userId) {
                await User.findByIdAndUpdate(
                    userId,
                    { $push: { reports: report._id } },
                    { new: true }
                );
                await createNotification(userId, "User", "Report Created", `Your report "${title}" has been successfully submitted and is pending admin approval.`);
            }

            res.status(201).json({
                success: true, message: "Report raised successfully",
                report: {
                    id: report._id, title: report.title, description: report.description,
                    imageUrl: report.imageUrl, category: report.category, status: report.status,
                    upvotes: report.upvotes, createdBy: report.createdBy, location: report.location
                }
            })
        } finally {
            // Delete temp file after everything is done
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Failed to delete temp file:", err);
                });
            }
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Could not create Report" })

    }
}

//Upvote an particular report
const upvoteAReport = async (req, res) => {
    try {
        const userId = req.user?._id
        const { id } = req.params
        const report = await Report.findById(id)
        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found" })
        }
        const alreadyUpvoted = report.upvotedUsers.some(
            (uid) => uid.toString() === userId.toString()
        )

        if (alreadyUpvoted) {
            report.upvotedUsers.pull(userId)
            await User.findByIdAndUpdate(
                userId,
                { $pull: { upvotedReports: report._id } },
                { new: true }
            )
        } else {
            report.upvotedUsers.push(userId)
            await User.findByIdAndUpdate(
                userId,
                { $addToSet: { upvotedReports: report._id } },
                { new: true }
            )
            // Notify report creator that someone upvoted their report
            if (report.createdBy && report.createdBy.toString() !== userId.toString()) {
                await createNotification(report.createdBy, "User", "New Upvote", `Your report "${report.title}" received a new upvote!`);
            }
        }
        report.upvotes = report.upvotedUsers.length;
        await report.save();
        res.status(200).json({ success: true, message: alreadyUpvoted ? "Upvote removed" : "Issue upvoted", upvotes: report.upvotes })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Could not upvote" })
    }
}


// Get to view a particular report in detail - Who is looking at report in detail - ? Gig worker? Maybe?
// Is even citizen viewing it in detail before upvoting?
const getParticularReports = async (req, res) => {
    try {
        const { id } = req.params
        const report = await Report.findById(id)
        if (!report)
            return res.status(400).json({ success: false, message: "Could not find report" })

        res.status(200).json({ success: true, report })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: 'Could not fetch that report' })
    }
}

// Need to develop it for the community section
const getReportsByLocation = async (req, res) => {
    try {
        const userId = req.user?._id

        //Get user's reports with coordinates
        const userReports = await Report.find({ createdBy: userId }, "location.coordinates");

        if (userReports.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No previous reports found for user.",
                reports: [],
            })
        }
        const allNearByReports = []
        const searchRadius = 5000;

        // For each of user report location, find nearby coordinates
        for (const userReport of userReports) {
            const [long, lat] = userReport.location.coordinates

            const nearby = await Report.find({
                //  createdBy: { $ne: userId }, // To avoid showing user his own said reports
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [long, lat] },
                        $maxDistance: searchRadius
                    }
                }
            })
                .populate("createdBy", "name email")
                .limit(50);

            allNearByReports.push(...nearby)
        }

        //Deduplicate results
        const uniqueReportsMap = new Map();
        for (const r of allNearByReports) {
            uniqueReportsMap.set(r._id.toString(), r)
        }

        const uniqueReports = Array.from(uniqueReportsMap.values())
        res.status(200).json({
            success: true, message: "Fetched feed on basis of location",
            count: uniqueReports.length,
            reports: uniqueReports,
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Could not fetch nearby reports from location" })
    }
}

export { createReport, upvoteAReport, getParticularReports, getReportsByLocation }