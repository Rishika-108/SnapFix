import Bid from "../models/bidModel.js"
import Worker from "../models/gigWorkerModel.js"
import Report from "../models/reportModel.js"
import Task from "../models/taskAssignmentModel.js"
import Payment from "../models/paymentModel.js"
import mongoose from "mongoose";
import { createNotification } from "./notificationController.js";


// Lists out all the report for the admin to view
const viewAllReports = async (req, res) => {
    try {
        const userId = req.user?._id
        if (!userId) {
            return res.status(401).json({ success: false, message: "You are not authorised to view reports" })
        }
        if (!['Local', 'State', 'Central', 'admin'].includes(req.role)) {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }
        const allReports = await Report.find({})
        res.status(200).json({ success: true, message: 'Reports Successfully Fetched', reports: allReports })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Could not fetch reports" })
    }

}
// Helps the admin view reports combined with bids
const viewReportWithBid = async (req, res) => {
    try {
        const userId = req.user?._id
        if (!userId) {
            return res.status(401).json({ success: false, message: "You are not authorised to view reports" })
        }
        if (!['Local', 'State', 'Central', 'admin'].includes(req.role)) {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }
        const { id } = req.params // Obtains Report ID

        const report = await Report.findById(id)
            .populate("createdBy", "name")

        if (!report)
            return res.status(404).json({ success: false, message: "Could not find this particular report" })

        const getBids = await Bid.find({ reportId: id})
            .populate("gigWorkerId", "name email")

        if (getBids.length === 0)
            return res.status(404).json({ success: false, message: "No Bids on this particular Report" })

        return res.status(200).json({
            success: true, message: "Report with bid fetched successfully",
            report, getBids

        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Could not fetch reports with the bids" })
    }

}

//Updates the status of the bid for the worker side
const approveBid = async (req, res) => {
  try {
    console.log("🔥 approveBid HIT", req.params.id);
    const adminId = req.user?._id;

    if (!adminId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!['Local', 'State', 'Central', 'admin'].includes(req.role)) {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    const { id } = req.params; // bidId

    const bid = await Bid.findById(id);
    if (!bid) {
      return res.status(404).json({ success: false, message: "Bid not found" });
    }

    if (bid.status !== "Pending") {
      return res.status(400).json({ success: false, message: "Bid already processed" });
    }

    // Prevent double assignment
    const existingTask = await Task.findOne({ reportId: bid.reportId });
    if (existingTask) {
      return res.status(400).json({
        success: false,
        message: "Task already assigned for this report",
      });
    }

    // Approve selected bid
    bid.status = "Approved";
    await bid.save();

    // Reject other bids
    await Bid.updateMany(
      { reportId: bid.reportId, _id: { $ne: bid._id } },
      { $set: { status: "Rejected" } }
    );

    // Create task
    const task = await Task.create({
      reportId: bid.reportId,
      gigWorkerId: bid.gigWorkerId,
      assignedBy: adminId,
      status: "Assigned",
      paymentStatus: "Pending",
    });

    // Update report
    const report = await Report.findByIdAndUpdate(
      bid.reportId,
      {
        $set: {
          assignedGigWorker: bid.gigWorkerId,
          status: "In Progress",
          adminApprovalStatus: "Approved",
        },
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Bid approved and task assigned successfully",
      bid,
      task,
    });

    // NOTIFICATIONS
    // 1. Notify Worker
    await createNotification(bid.gigWorkerId, "Worker", "Bid Approved", `Your bid for the report "${report.title}" has been approved! You can start working now.`);
    
    // 2. Notify Citizen
    if (report.createdBy) {
        await createNotification(report.createdBy, "User", "Work Started", `An expert has been assigned to fix your reported issue: "${report.title}".`);
    }

    return;


  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Could not assign bid" });
  }
};

// Admin will release the payment after citizen verifies the issue to be successful
// The gigworker walletBalance will be updated with his bid amount 
const paymentRelease = async (req, res) => {
   try {
    const adminId = req.user?._id;
    if (!adminId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!['Local', 'State', 'Central', 'admin'].includes(req.role)) {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }
    const {id} = req.params // Task ID
    
    const task = await Task.findById(id).populate("reportId gigWorkerId")
    if(!task) {
        return res.status(404).json({success: false, message: "Task Not Found"})
    }
    
    // Safety check: Ensure task is actually ready for payment
    if (!task.verifiedByCitizen || task.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Payment cannot be released until the task is verified by the citizen and status is 'Completed'.",
      });
    }

    if (task.paymentStatus === "Released") {
      return res.status(400).json({ success: false, message: "Payment has already been released for this task." });
    }

    if (!task.reportId || !task.gigWorkerId) {
      return res.status(400).json({ success: false, message: "Task data is incomplete (missing report or worker link)." });
    }

    // Find the corresponding approved bid to get the exact amount
    const bid = await Bid.findOne({
      reportId: task.reportId._id,
      gigWorkerId: task.gigWorkerId._id,
      status: "Approved",
    });

    if (!bid) {
      return res.status(404).json({ success: false, message: "No approved bid found. Cannot determine payment amount." });
    }

    const bidAmount = bid.bidAmount || 0;

    // 1. Update the worker's wallet balance
    const worker = await Worker.findById(task.gigWorkerId._id);
    if (!worker) {
      return res.status(404).json({ success: false, message: "Gig worker not found." });
    }

    // Atomic update of wallet balance
    worker.walletBalance = (worker.walletBalance || 0) + bidAmount;
    await worker.save();

    // 2. Create a Payment Record for auditing
    const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const payment = new Payment({
      taskId: task._id,
      gigWorkerId: worker._id,
      amount: bidAmount,
      status: "Released",
      releasedBy: adminId,
      transactionId: transactionId,
      releasedAt: new Date()
    });
    await payment.save();

    // 3. Update the task status
    task.paymentStatus = "Released";
    await task.save();

    // 4. Send Notifications
    // Notify Worker
    await createNotification(
      task.gigWorkerId._id, 
      "Worker", 
      "Payment Received", 
      `Payment of ₹${bidAmount} for "${task.reportId.title}" has been added to your wallet. Ref: ${transactionId}`
    );

    // Notify Citizen (Issue is officially closed)
    if (task.reportId.createdBy) {
        await createNotification(
          task.reportId.createdBy, 
          "User", 
          "Payment Released", 
          `The issue "${task.reportId.title}" is officially resolved. Payment has been released to the worker.`
        );
    }

    return res.status(200).json({
      success: true,
      message: `Payment of ₹${bidAmount} successfully released.`,
      transactionId,
      newWalletBalance: worker.walletBalance
    });

   } catch (error) {
     console.error("Payment Release Error:", error.message);
     res.status(500).json({success: false, message: "Internal server error during payment stimulation."})
   }
}

// Get all tasks that are completed and verified but payment is pending
const getCompletedTasks = async (req, res) => {
  try {
    const adminId = req.user?._id;
    if (!adminId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!['Local', 'State', 'Central', 'admin'].includes(req.role)) {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    const tasks = await Task.find({
      status: "Completed",
      verifiedByCitizen: true,
      paymentStatus: "Pending"
    })
    .populate("reportId")
    .populate("gigWorkerId", "name rating email");

    // We also need the bid amount for each task
    const tasksWithAmounts = await Promise.all(tasks.map(async (task) => {
      const bid = await Bid.findOne({
        reportId: task.reportId?._id,
        gigWorkerId: task.gigWorkerId?._id,
        status: "Approved"
      });
      
      return {
        ...task.toObject(),
        bidAmount: bid ? bid.bidAmount : 0,
        duration: bid ? bid.duration : "N/A"
      };
    }));

    res.status(200).json({
      success: true,
      tasks: tasksWithAmounts
    });
  } catch (error) {
    console.error("Error fetching completed tasks:", error.message);
    res.status(500).json({ success: false, message: "Could not fetch completed tasks" });
  }
};

export { viewAllReports, viewReportWithBid, approveBid, paymentRelease, getCompletedTasks}