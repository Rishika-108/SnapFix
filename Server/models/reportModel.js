import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }
    },
    upvotes: { type: Number, default: 0 },
    upvotedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'], default: 'Pending' },
    assignedGigWorker: { type: mongoose.Schema.Types.ObjectId, ref: "Worker" },
    adminApprovalStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    paymentReleased: { type: Boolean, default: false },
}, { timestamps: true })

reportSchema.index({ createdBy: 1 })
reportSchema.index({ location: '2dsphere' })

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
export default Report;