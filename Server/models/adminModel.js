import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email : {type: String, required: true},
    password : {type: String, required: true},
    role : {type: String, enum: ['Local', 'State','Central'], default: 'Local', required: true},
}, {timestamps: true})

adminSchema.index({jurisdiction: '2dsphere'})

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
export default Admin;