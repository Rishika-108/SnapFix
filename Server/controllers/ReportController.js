import { v2 as cloudinary } from 'cloudinary'
import Report from "../models/reportModel.js";
import User from "../models/userModel.js";
import fs from "fs";

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
        const report = await Report.create({
            title, description, imageUrl: cloudinaryResult.secure_url, category, createdBy: userId || null,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            }
        })

        if (userId) {
            await User.findByIdAndUpdate(
                userId,
                { $push: { reports: report._id } },
                { new: true }
            );
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