import Bid from "../models/bidModel.js"
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

// Payment Release after posititvely verified by the citizen

export { viewAllReports, viewReportWithBid, approveBid }