import mongoose from "mongoose"
import Bid from "../models/bidModel.js"

// The gigworker creates a bid on a report
const createBid = async (req, res) => {
    try {
        const userId = req.user?._id
        const { id } = req.params
        const { bidAmount, resourceNote, duration } = req.body

        if (!userId) return res.status(400).json({ success: false, message: 'User not logged In' })

        // Check if report exists
        const report = await mongoose.model('Report').findById(id);
        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        const existingBid = await Bid.findOne({ reportId : id, gigWorkerId: userId });
        if (existingBid) {
            return res.status(400).json({
                success: false,
                message: "You have already placed a bid on this report",
            });
        }
        const bid = await Bid.create({
            reportId: id, gigWorkerId: userId, bidAmount, resourceNote, duration
        })
        res.status(201).json({
            success: true, message: "Bid Applied Successfully",
            bid: {
                id: bid._id, reportId: bid.reportId, gigWorkerId: bid.gigWorkerId,
                bidAmount: bid.bidAmount, resourceNote: bid.resourceNote, duration: bid.duration,
                status: bid.status
            }
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Could not create a bid" })
    }


}
export { createBid }