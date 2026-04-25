import Report from "../models/reportModel.js"
import Task from "../models/taskAssignmentModel.js"
import { v2 as cloudinary } from 'cloudinary'
import fs from "fs";
import { createNotification } from "./notificationController.js";

// Upload your proof for the work you have done - Made for gigWorker
const uploadProof = async (req, res) => {
  try {
    // 1️⃣ Extract params FIRST
    const { id } = req.params; // Task ID
    const { remarks, latitude, longitude } = req.body;

    // 2️⃣ Auth checks
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (req.role !== "gigworker") {
      return res.status(403).json({
        success: false,
        message: "Access denied: only gig workers can upload proof",
      });
    }

    // 3️⃣ Validate input
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Location is missing",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // 4️⃣ Fetch task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // 5️⃣ Ownership check
    if (task.gigWorkerId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this task",
      });
    }

    if (task.status === "Proof Submitted") {
      return res.status(400).json({
        success: false,
        message: "Proof already submitted",
      });
    }

    // 6️⃣ Upload to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "reports_uploads" }
    );

    fs.unlinkSync(req.file.path); // cleanup local file

    // 7️⃣ Update task
    task.proof = {
      imageUrl: cloudinaryResult.secure_url,
      remarks,
      uploadedAt: Date.now(),
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    };

    task.status = "Proof Submitted";
    await task.save();

    // 8️⃣ Response
    res.status(200).json({
      success: true,
      message: "Proof uploaded successfully",
      task,
    });

    // NOTIFICATION
    // Notify Citizen to verify
    const populatedTask = await Task.findById(id).populate("reportId");
    if (populatedTask.reportId && populatedTask.reportId.createdBy) {
        await createNotification(populatedTask.reportId.createdBy, "User", "Proof Submitted", `The worker has submitted proof for your report "${populatedTask.reportId.title}". Please verify the work.`);
    }

    return;


  } catch (error) {
    console.error("uploadProof error:", error.message);
    res.status(500).json({
      success: false,
      message: "Could not upload proof",
    });
  }
};


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

            res.status(200).json({ success: true, message: "Task Accepted by the citizen", task: completedTask })
            
            // NOTIFICATION
            await createNotification(completedTask.gigWorkerId, "Worker", "Task Verified", `Great news! The citizen has verified and accepted your work for "${completedTask.reportId.title}".`);
            
            return;
        } else {
            completedTask.verifiedByCitizen = false
            completedTask.verifiedAt = new Date()
            completedTask.status = "Rejected"
            await completedTask.save()

            await Report.findByIdAndUpdate(completedTask.reportId._id, {
                $set: { status: "Rejected" },
            });
            completedTask.reportId.status = "Rejected";

            res.status(200).json({ success: true, message: "Task Rejected by the citizen", task: completedTask })

            // NOTIFICATION
            await createNotification(completedTask.gigWorkerId, "Worker", "Task Rejected", `The citizen has rejected your work for "${completedTask.reportId.title}". Please check the feedback and try again.`);

            return;
        }



    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Could not verify" })
    }
}

// Get all the tasks assigned to the gig worker - Made for assigned GigWorker   
const getMyTasks = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (req.role !== "gigworker") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const tasks = await Task.find({ gigWorkerId: userId })
            .populate("reportId", "title description locationName status")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            tasks,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "Could not fetch assigned tasks",
        });
    }
};


// Get detailed overview of the task - Made for assigned GigWorker 
// Not currently much in use - Maybe for later versions
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

export { uploadProof, verifyByCitizen, getTaskDetail, getMyTasks }