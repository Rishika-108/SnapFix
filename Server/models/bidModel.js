import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
    reportId : {type: mongoose.Schema.Types.ObjectId, ref: "Report"},
    gigWorkerId: {type: mongoose.Schema.Types.ObjectId, ref: "Worker"},
    bidAmount : {type: Number, min: 0},
    resourceNote : {type: String},
    duration : {type: String},
    status:{type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending'},
}, {timestamps: true})

const Bid = mongoose.models.Bid || mongoose.model('Bid', bidSchema)
export default Bid 