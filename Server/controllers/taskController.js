import Report from "../models/reportModel.js"
import Task from "../models/taskAssignmentModel.js"
import { v2 as cloudinary } from 'cloudinary'
import fs from "fs";

// Will need to check if endpoints are working fine or not


// Upload your proof for the work you have done - Made for gigWorker
const uploadProof = async (req, res) => {
    try {
        const userId = req.user?._id // Gig Worker Id
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
        if (req.role !== 'gigworker') {
            return res.status(403).json({ success: false, message: "Access denied: only assigned gig workers can upload proof" });
        }
        const { id } = req.params // Report Id
        const { remarks, latitude, longitude } = req.body

        if (!latitude || !longitude) {
            return res.status(400).json({ success: false, message: "Location is missing" })
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }
        const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "reports_uploads",
        });

        fs.unlinkSync(req.file.path); // Removes files from from local disk storage, thereby removing
        // EPERM erro
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            {
                $set: {
                    "proof.imageUrl": cloudinaryResult.secure_url,
                    "proof.remarks": remarks,
                    status: "Proof Submitted",
                    "proof.uploadedAt": Date.now(),
                    "proof.location": {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    }
                }
            }, { new: true }
        )
        if (!updatedTask) return res.status(404).json({ success: false, message: "Task Not found or assgined yet" })

        res.status(200).json({ success: true, message: "Proof uploaded successfully", task: updatedTask })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Could not upload proof" })
    }
}

// After the proof has been uploaded - the citizen can verify if the task has been done properly or not
const verifyByCitizen = async (req, res) => {
    try {
        const userId = req.user?._id
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
        if (req.role !== 'citizen') {
            return res.status(403).json({ success: false, message: "Only the report creator can verify tasks" });
        }
        const { id } = req.params
        const { isSatisfied } = req.body

        const completedTask = await Task.findById(id)
            .populate("reportId", "createdBy status")

        if (!completedTask) return res.status(404).json({ success: false, message: "Task not completed" })
        if (completedTask?.reportId?.createdBy?.toString() !== userId.toString())
            return res.status(403).json({ success: false, message: "You are not authorised to verify the task" })


        if (isSatisfied) {
            completedTask.verifiedByCitizen = true
            completedTask.verifiedAt = new Date()
            completedTask.status = "Completed" 
            await completedTask.save()

            await Report.findByIdAndUpdate(completedTask.reportId._id, {
                $set: { status: "Resolved" },
            });
            completedTask.reportId.status = "Resolved";

            return res.status(200).json({ success: true, message: "Task Accepted by the citizen", task: completedTask })
        } else {
            completedTask.verifiedByCitizen = false
            completedTask.verifiedAt = new Date()
            completedTask.status = "Rejected"
            await completedTask.save()

            await Report.findByIdAndUpdate(completedTask.reportId._id, {
                $set: { status: "Rejected" },
            });
            completedTask.reportId.status = "Rejected";

            return res.status(200).json({ success: true, message: "Task Rejected by the citizen", task: completedTask })
        }


    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Could not verify" })
    }
}

// Get detailed overview of the task - Made for assigned GigWorker 
const getTaskDetail = async (req, res) => {
    try {
        const { id } = req.params
        const task = await Task.findById(id)

        if (!task) return res.status(404).json({ success: false, message: 'Tasks not assigned' })

        const userId = req.user?._id;
        const userRole = req.role;

        const isAssignedWorker = task.gigWorkerId?._id.toString() === userId.toString();
        const isAdmin = ['Local', 'State', 'Central'].includes(userRole);

        if (!isAssignedWorker && !isAdmin) {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }

        res.status(200).json({ success: true, message: "Task Details fetched successfully", task })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Could not fetch task details" })
    }
}

export { uploadProof, verifyByCitizen, getTaskDetail }