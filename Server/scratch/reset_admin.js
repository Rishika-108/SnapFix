import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../Server/.env') });

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Local', 'State', 'Central', 'admin'], default: 'Local' }
});

const Admin = mongoose.model('Admin', adminSchema);

async function resetAdmin() {
    try {
        console.log("Connecting to:", process.env.CONNECTION_STRING);
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Connected to MongoDB");

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        const hashed = await bcrypt.hash(password, 10);
        
        const result = await Admin.findOneAndUpdate(
            { email: email },
            { password: hashed },
            { upsert: true, new: true }
        );

        console.log("Admin password reset successfully for:", result.email);
        process.exit(0);
    } catch (err) {
        console.error("Error resetting admin:", err);
        process.exit(1);
    }
}

resetAdmin();
