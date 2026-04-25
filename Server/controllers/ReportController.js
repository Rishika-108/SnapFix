import { v2 as cloudinary } from 'cloudinary'
import Report from "../models/reportModel.js";
import User from "../models/userModel.js";
import fs from "fs";
import axios from "axios";
import { createNotification } from "./notificationController.js";

//create a new report
const createReport = async (req, res) => {
    try {
        const { title, description, category, latitude, longitude } = req.body;
        // AI Logic for checking duplicate will come later, but here.
        if (latitude == null || longitude == null) {
            return res.status(400).json({ success: false, message: "Location is missing" })
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }
        const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "reports_uploads",
        });
        setTimeout(() => {
  fs.unlink(req.file.path, (err) => {
    if (err) console.error("Failed to delete temp file:", err);
  });
}, 500);

        const userId = req.user?._id

        // --- AI ENGINE INTEGRATION ---
        let aiResult = null;
        try {
            const aiResponse = await axios.post(`${process.env.AI_SERVER_URL}/predict_url`, {
                image_url: cloudinaryResult.secure_url,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                description: description || ""
            });
            aiResult = aiResponse.data;
        } catch (aiError) {
            console.error("AI Engine Error:", aiError.message);
            // Fallback: Proceed without AI if server is down, but log it.
        }

        // Handle "Not a civic issue"
        if (aiResult && aiResult.status === "Rejected - Not a civic issue") {
            return res.status(400).json({ 
                success: false, 
                message: "Our AI system flagged this image as a non-civic issue. Please upload a relevant photo of a civic problem.",
                aiDetail: aiResult
            });
        }

        // Handle duplicates (Optional: if we want to auto-upvote instead of creating new)
        // Handle duplicates - Check Mongo for same category within 50 meters
        const finalCategory = aiResult ? aiResult.category : category;
        const duplicateReport = await Report.findOne({
            category: finalCategory,
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
                    $maxDistance: 50 // 50 meters
                }
            }
        });

        if (duplicateReport) {
            // Auto-upvote the existing report instead of creating a new one
            const alreadyUpvoted = duplicateReport.upvotedUsers.some(
                (uid) => uid.toString() === userId?.toString()
            );

            if (!alreadyUpvoted && userId) {
                duplicateReport.upvotedUsers.push(userId);
                duplicateReport.upvotes = duplicateReport.upvotedUsers.length;
                await duplicateReport.save();
                
                await createNotification(userId, "User", "Duplicate Issue Detected", `A similar issue in the category "${finalCategory}" was already reported nearby. We've automatically added your upvote to the existing report to increase its priority!`);
            }

            return res.status(200).json({ 
                success: true, 
                message: "A similar issue is already reported. Your upvote has been added to it.",
                report: duplicateReport,
                isDuplicate: true
            });
        }

        const report = await Report.create({
            title, 
            description, 
            imageUrl: cloudinaryResult.secure_url, 
            category: aiResult ? aiResult.category : category, 
            createdBy: userId || null,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            priority: aiResult ? aiResult.priority : 'Low',
            aiConfidence: aiResult ? aiResult.confidence : 0
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