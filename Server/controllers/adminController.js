import Bid from "../models/bidModel.js"
import Worker from "../models/gigWorkerModel.js"
import Report from "../models/reportModel.js"
import Task from "../models/taskAssignmentModel.js"

// Lists out all the report for the admin to view
const viewAllReports = async (req, res) => {
    try {
        const userId = req.user?._id
        if (!userId) {
            return res.status(401).json({ success: false, message: "You are not authorised to view reports" })
        }
        if (!['Local', 'State', 'Central'].includes(req.role)) {
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
        if (!['Local', 'State', 'Central'].includes(req.role)) {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }
        const { id } = req.params // Obtains Report ID

        const report = await Report.findById(id)
            .populate("createdBy", "name")

        if (!report)
            return res.status(404).json({ success: false, message: "Could not find this particular report" })

        const getBids = await Bid.find({ reportId: id })
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
        const userId = req.user?._id
        if (!userId) {
            return res.status(401).json({ success: false, message: "You are not authorised to view reports" })
        }
        if (!['Local', 'State', 'Central'].includes(req.role)) {
            return res.status(403).json({ success: false, message: "Access Denied" });
        }
        const { id } = req.params // Obtains bid id
        //    const adminId = req.user?._id

        //    if(!adminId) return res.status(401).json({success: false, message: "Unauthorised Admin"})
        const bid = await Bid.findById(id)
            .populate("gigWorkerId", "name email phone")
            .populate("reportId", "title status")

        if (!bid)
            return res.status(404).json({ success: false, message: "Bid not found" })

        bid.status = "Approved"
        await bid.save()

        await Bid.updateMany(
            { reportId: bid.reportId, _id: { $ne: bid._id } },
            { $set: { status: "Rejected" } }
        );


        const task = await Task.create({
            reportId: bid.reportId, gigWorkerId: bid.gigWorkerId, /*assignedBy: adminId,*/ status: 'Assigned',
            paymentStatus: "Pending",
    //        proof: {
    //     location: { type: "Point", coordinates: [0, 0] } // placeholder
    // }
        })

        await Report.findByIdAndUpdate(
            bid.reportId,
            {
                $set: {
                    assignedGigWorker: bid.gigWorkerId,
                    status: "In Progress",
                    adminApprovalStatus: "Approved"
                },

            }, { new: true }

        )

        res.status(201).json({
            success: true, message: "Bid Approved and Task Assigned Successfully",
            bid, task
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Could not approve Bid" })
    }
}
// Admin will release the payment after citizen verifies the issue to be successful
// The gigworker walletBalance will be updated with his bid amount 
const paymentRelease = async (req, res) => {
   try {
    //   const userId = req.user?._id
    // if (!userId) {
    //         return res.status(401).json({ success: false, message: "You are not authorised to view reports" })
    //     }
    const {id} = req.params // Task ID
    
    const task = await Task.findById(id).populate("reportId gigWorkerId")
    if(!task) {
        return res.status(404).json({success: false, message: "Task Not Found"})
    }
    if (!task.verifiedByCitizen || task.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Payment cannot be released until the task is verified and completed.",
      });
    }

    if (!task.reportId || !task.gigWorkerId) {
  return res.status(400).json({ success: false, message: "Task references missing or invalid" });
}


    if (task.paymentStatus === "Released") {
      return res.status(400).json({ success: false, message: "Payment already released." });
    }

    // Find the corresponding bid to get bidAmount
    const bid = await Bid.findOne({
      reportId: task.reportId._id,
      gigWorkerId: task.gigWorkerId._id,
      status: "Approved",
    });

    if (!bid) {
      return res.status(404).json({ success: false, message: "Approved bid not found for this task" });
    }

    const bidAmount = bid.bidAmount || 0;

    // Update the worker's wallet balance
    const worker = await Worker.findById(task.gigWorkerId._id);
    if (!worker) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }

    worker.walletBalance += bidAmount;
    await worker.save();

    // Update the task payment status
    task.paymentStatus = "Released";
    await task.save();

    return res.status(200).json({
      success: true,
      message: `Payment of ₹${bidAmount} released to ${worker.name}`,
      updatedWallet: worker.walletBalance,
      task,
    });
   } catch (error) {
     console.log(error.message)
     res.status(500).json({success: false, message: "Could not stimulate payment release"})
   }
}


export { viewAllReports, viewReportWithBid, approveBid, paymentRelease}