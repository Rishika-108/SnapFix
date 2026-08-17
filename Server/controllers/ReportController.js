import { v2 as cloudinary } from 'cloudinary'
import Report from "../models/reportModel.js";
import User from "../models/userModel.js";
import fs from "fs";
import axios from "axios";
import { createNotification } from "./notificationController.js";
import FormData from 'form-data';
import mongoose from 'mongoose';
import sharp from 'sharp';
import https from 'https';

const httpsAgent = new https.Agent({
    keepAlive: true,
    maxSockets: 50,
    keepAliveMsecs: 30000
});

const calculateCosineSimilarity = (vec1, vec2) => {
    if (!vec1 || !vec2 || vec1.length === 0 || vec1.length !== vec2.length) return 0;
    let dotProduct = 0;
    for (let i = 0; i < vec1.length; i++) {
        dotProduct += vec1[i] * vec2[i];
    }
    return dotProduct;
};

// Create a new report - Time testing version
const createReport = async (req, res) => {
    const requestStart = performance.now();

    try {
        const {
            title,
            description,
            category,
            latitude,
            longitude
        } = req.body;

        // =========================================================
        // 0. VALIDATION
        // =========================================================

        if (latitude == null || longitude == null) {
            return res.status(400).json({
                success: false,
                message: "Location is missing"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const userId = req.user?._id;

        // =========================================================
        // 1. CLOUDINARY + AI
        // =========================================================

        const compressionStart = performance.now();

        // 1. Fast in-memory downscaling & JPEG compression via sharp (takes ~10-15ms)
        const compressedBuffer = await sharp(req.file.path)
            .resize(1280, 1280, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer();

        console.log(
            `⏱️ Sharp compression: ${(performance.now() - compressionStart).toFixed(2)} ms ` +
            `(${(req.file.size / 1024).toFixed(0)}KB -> ${(compressedBuffer.length / 1024).toFixed(0)}KB)`
        );

        const cloudinaryStart = performance.now();
        const aiStart = performance.now();

        const baseUrl = process.env.AI_SERVER_URL?.replace(/\/$/, "");

        // 2. Stream compressed buffer (~100KB) to Cloudinary via upload_stream
        const cloudinaryPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "reports_uploads",
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) {
                        console.error("❌ Cloudinary Error:", error.message);
                        reject(error);
                    } else {
                        console.log(
                            `⏱️ Cloudinary upload: ${(performance.now() - cloudinaryStart).toFixed(2)} ms`
                        );
                        resolve(result);
                    }
                }
            );
            uploadStream.end(compressedBuffer);
        });

        // 3. Prepare AI payload with compressed buffer
        const formData = new FormData();
        formData.append(
            "file",
            compressedBuffer,
            {
                filename: "report.jpg",
                contentType: "image/jpeg"
            }
        );

        // Start AI immediately
        const aiPromise = axios
            .post(
                `${baseUrl}/get_embedding`,
                formData,
                {
                    headers: {
                        ...formData.getHeaders()
                    },
                    httpsAgent,
                    timeout: 15000
                }
            )
            .then(response => {
                console.log(
                    `⏱️ AI request: ${(performance.now() - aiStart).toFixed(2)} ms`
                );

                return response;
            })
            .catch(error => {
                console.error(
                    "❌ AI Engine Error:",
                    error.message
                );

                console.log(
                    `⏱️ AI request failed: ${(performance.now() - aiStart).toFixed(2)} ms`
                );

                return {
                    data: null
                };
            });

        const parallelStart = performance.now();

        const [
            cloudinaryResult,
            aiResponse
        ] = await Promise.all([
            cloudinaryPromise,
            aiPromise
        ]);

        console.log(
            `⏱️ Cloudinary + AI total: ${(performance.now() - parallelStart).toFixed(2)} ms`
        );

        const aiResult = aiResponse?.data;

        // =========================================================
        // 2. AI VALIDATION
        // =========================================================

        const aiValidationStart = performance.now();

        const CONFIDENCE_THRESHOLD = 0.5;

        if (
            aiResult &&
            (
                !aiResult.is_valid ||
                aiResult.confidence < CONFIDENCE_THRESHOLD
            )
        ) {
            console.log(
                `⏱️ AI validation: ${(performance.now() - aiValidationStart).toFixed(2)} ms`
            );

            return res.status(400).json({
                success: false,
                message:
                    `Our AI system flagged this image as a non-civic issue ` +
                    `or is not confident enough ` +
                    `(Confidence: ${(aiResult.confidence * 100).toFixed(1)}%). ` +
                    `Please upload a relevant and clear photo of a civic problem.`,
                aiDetail: aiResult
            });
        }

        console.log(
            `⏱️ AI validation: ${(performance.now() - aiValidationStart).toFixed(2)} ms`
        );

        // =========================================================
        // 3. NEARBY REPORT QUERY
        // =========================================================

        const duplicateQueryStart = performance.now();

        const nearbyReports = await Report.find({
            status: {
                $in: ["Pending", "In Progress"]
            },
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            Number(longitude),
                            Number(latitude)
                        ]
                    },
                    $maxDistance: 50
                }
            }
        })
            .select(
                "_id category embedding upvotedUsers upvotes createdBy title"
            )
            .limit(10)
            .lean();

        console.log(
            `⏱️ Nearby report query: ${(performance.now() - duplicateQueryStart).toFixed(2)} ms`
        );

        // =========================================================
        // 4. DUPLICATE CHECK
        // =========================================================

        const similarityStart = performance.now();

        let duplicateReport = null;

        if (aiResult?.embedding) {

            for (const report of nearbyReports) {

                const similarity = calculateCosineSimilarity(
                    aiResult.embedding,
                    report.embedding
                );

                if (similarity > 0.9) {
                    duplicateReport = report;
                    break;
                }
            }

        } else {

            duplicateReport = nearbyReports.find(
                report => report.category === category
            );

        }

        console.log(
            `⏱️ Embedding comparison: ${(performance.now() - similarityStart).toFixed(2)} ms`
        );

        // =========================================================
        // 5. HANDLE DUPLICATE
        // =========================================================

        if (duplicateReport) {

            const duplicateStart = performance.now();

            const alreadyUpvoted =
                duplicateReport.upvotedUsers?.some(
                    uid =>
                        uid.toString() === userId?.toString()
                );

            if (!alreadyUpvoted && userId) {

                await Report.findByIdAndUpdate(
                    duplicateReport._id,
                    {
                        $addToSet: {
                            upvotedUsers: userId
                        },
                        $inc: {
                            upvotes: 1
                        }
                    }
                );

                await createNotification(
                    userId,
                    "User",
                    "Duplicate Issue Detected",
                    `A similar issue in the category "${duplicateReport.category}" ` +
                    `was already reported nearby. We've automatically added ` +
                    `your upvote to the existing report to increase its priority!`
                );
            }

            console.log(
                `⏱️ Duplicate handling: ${(performance.now() - duplicateStart).toFixed(2)} ms`
            );

            console.log(
                `🚀 TOTAL POST /reports: ${(performance.now() - requestStart).toFixed(2)} ms`
            );

            return res.status(200).json({
                success: true,
                message:
                    "A similar issue is already reported. " +
                    "Your upvote has been added to it.",
                report: duplicateReport,
                isDuplicate: true
            });
        }

        // =========================================================
        // 6. LOCALIZED CONTENT
        // =========================================================

        const localizedContent = {
            en: {
                title,
                description
            },
            hi: {
                title,
                description
            }
        };

        // =========================================================
        // 7. CREATE REPORT
        // =========================================================

        const reportDbStart = performance.now();

        const reportDoc = {
            title,
            description,
            imageUrl: cloudinaryResult.secure_url,
            category,
            createdBy: userId ? new mongoose.Types.ObjectId(userId) : null,
            location: {
                type: "Point",
                coordinates: [
                    Number(longitude),
                    Number(latitude)
                ]
            },
            upvotes: 0,
            upvotedUsers: [],
            status: "Pending",
            assignedGigWorker: null,
            adminApprovalStatus: "Pending",
            paymentReleased: false,
            priority: "Low",
            aiConfidence: aiResult?.confidence || 0,
            embedding: aiResult?.embedding || [],
            localizedContent,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const insertResult = await Report.collection.insertOne(reportDoc);
        const report = { _id: insertResult.insertedId, ...reportDoc };

        console.log(
            `⏱️ Report DB create: ${(performance.now() - reportDbStart).toFixed(2)} ms`
        );

        // =========================================================
        // 8. RESPONSE
        // =========================================================

        const totalTime = performance.now() - requestStart;

        console.log(
            `🚀 TOTAL POST /reports: ${totalTime.toFixed(2)} ms`
        );

        const responsePayload = {
            success: true,
            message: "Report raised successfully",
            report: {
                id: report._id,
                title: report.title,
                description: report.description,
                imageUrl: report.imageUrl,
                category: report.category,
                status: report.status,
                upvotes: report.upvotes,
                createdBy: report.createdBy,
                location: report.location
            }
        };

        // Send response immediately.
        // AI validation, duplicate detection and Report.create()
        // have already completed at this point.
        res.status(201).json(responsePayload);

        // =========================================================
        // 9. SECONDARY WORK
        // =========================================================
        // These operations are NOT required to decide whether the
        // report is valid, so they don't need to delay the response.

        if (userId) {

            // USER UPDATE
            const userUpdateStart = performance.now();

            try {
                await User.findByIdAndUpdate(
                    userId,
                    {
                        $push: {
                            reports: report._id
                        }
                    }
                );

                console.log(
                    `⏱️ Background user update: ${(performance.now() - userUpdateStart).toFixed(2)} ms`
                );

            } catch (error) {
                console.error(
                    "❌ Background user update failed:",
                    error.message
                );
            }

            // NOTIFICATION
            const notificationStart = performance.now();

            try {
                await createNotification(
                    userId,
                    "User",
                    "Report Created",
                    `Your report "${title}" has been successfully submitted ` +
                    `and is pending admin approval.`
                );

                console.log(
                    `⏱️ Background notification: ${(performance.now() - notificationStart).toFixed(2)} ms`
                );

            } catch (error) {
                console.error(
                    "❌ Background notification failed:",
                    error.message,

                );
            }
        }

        return;



    } catch (error) {
        console.error("CREATE REPORT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    } finally {

        // =========================================================
        // DELETE TEMPORARY FILE
        // =========================================================

        if (req.file?.path) {
            fs.unlink(
                req.file.path,
                err => {
                    if (err) {
                        console.error(
                            "Failed to delete temp file:",
                            err
                        );
                    }
                }
            );
        }
    }
};

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

export { calculateCosineSimilarity, createReport, upvoteAReport, getParticularReports, getReportsByLocation }