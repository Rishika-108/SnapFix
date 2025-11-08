import mongoose from "mongoose";

const taskAssignmentSchema = new mongoose.Schema({
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
    gigWorkerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker" },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    status: { type: String, enum: ['In Progress', 'Proof Submitted', 'Completed', 'Rejected', 'Assigned'], default: 'Assigned' },
    paymentStatus: { type: String, enum: ['Pending', 'Released', 'Failed'], default: 'Pending' },
    proof: {
        imageUrl: { type: String },
        location: {
            type: { type: String, enum: ['Point'] /*, default: 'Point'*/ },
            coordinates: { type: [Number], required: false } // allow empty for now
        },
        remarks: { type: String },
        uploadedAt: { type: Date, default: Date.now }
    },

    verifiedByCitizen: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5 },
    verifiedAt: { type: Date, default: null },
}, { timestamps: true })

taskAssignmentSchema.index({ 'proof.location': '2dsphere' }, { sparse: true })


const Task = mongoose.models.Task || mongoose.model('Task', taskAssignmentSchema)
export default Task 