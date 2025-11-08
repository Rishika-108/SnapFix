import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId},
    userType : {type: String, enum: ['User', 'Worker', 'Admin'], required: true},
    type: {type: String},
    message: {type: String, required: true},
    isRead : {type: Boolean, default: false},
}, {timestamps: true})

notificationSchema.index({userId: 1, isRead: 1})

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema)
export default Notification