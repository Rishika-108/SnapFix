import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email : {type: String, required: true},
    password: {type: String, required: true},
    phone : {type: String, required: true},
    skills: [{type: String, required: true}],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    approvedStatus: {type: String, enum:['Pending','Verified', 'Rejected']},
    location : {
        type: {type: String, enum:['Point'], default: 'Point'},
        coordinates: {type: [Number], required: true}
    },
    completedTasks: [{type: mongoose.Schema.Types.ObjectId, ref: "Task"}],
    walletBalance: {type: Number, default: 0},
    role: {type: String, enum: ['gigworker'], default: "gigworker", required: true},
}, {timestamps: true})

workerSchema.index({location: '2dsphere'})
const Worker = mongoose.models.Worker || mongoose.model('Worker', workerSchema)
export default Worker;