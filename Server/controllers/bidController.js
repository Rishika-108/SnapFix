import mongoose from "mongoose"
import Bid from "../models/bidModel.js"

const createBid = async (req,res) => {
   try {
     const userId = req.user?._id
    const {id} = req.params
    const {bidAmount, resourceNote, duration} = req.body

    if(!userId) return res.status(400).json({success: false, message: 'User not logged In'})
    const bid = await Bid.create({
        reportId: id , gigWorkerId: userId,   bidAmount, resourceNote, duration
    })
    res.status(201).json({success: true, message: "Bid Applied Successfully", 
        bid: {id: bid._id, reportId: bid.reportId, gigWorkerId: bid.gigWorkerId ,
        bidAmount: bid.bidAmount, resourceNote: bid.resourceNote, duration:bid.duration, 
        status: bid.status}
    })
   } catch (error) {
       console.log(error.message)
       res.status(500).json({success: false, message: "Could not create a bid"})
   }


}

//Maybe we dont need this
const getBidOnReport = async (req,res) => {
    try {
        const {id} = req.params
        const getBids = await Bid.find({ reportId: id })
        // .populate("gigworkerId", "name email")


        if(getBids.length === 0)
            return res.status(404).json({success: false, message: "No Bids on this particular Report"})


        res.status(200).json({success: true, message: "Bids fetched successfully", bids: getBids})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: "Could not fetch bids on this report"})
    }
}


export {createBid, getBidOnReport}