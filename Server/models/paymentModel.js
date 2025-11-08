import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    taskId : {type: mongoose.Schema.Types.ObjectId, ref: "Task"},
    gigWorkerId : {type: mongoose.Schema.Types.ObjectId, ref: "Worker"},
    amount : {type: Number, min: 0},
    status : {type: String, enum:['Pending', 'Released', 'Failed'], default:'Pending'},
    releasedBy: {type: mongoose.Schema.Types.ObjectId, ref: "Admin"},
    transactionId: {type: String},  
    releasedAt : {type: Date, default: null},
}, {timestamps: true})

paymentSchema.index({taskId: 1}),
paymentSchema.index({gigWorkerId: 1})

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema)
export default Payment