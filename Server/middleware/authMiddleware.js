import jwt, { decode } from "jsonwebtoken"
import User from "../models/userModel.js";
import Worker from "../models/gigWorkerModel.js";
import Admin from "../models/adminModel.js";


const authMiddleware = async (req,res,next) => { 
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({success: false, message: "Token not provided"})

        const token = authHeader.split(' ')[1]; 

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Decide which model to query based on role
        let account;
        switch (decoded.role) {
            case "citizen":
                account = await User.findById(decoded.id).select('-password')
                break;
            case "gigworker":
                account = await Worker.findById(decoded.id).select('-password')
                break;
            case "Local":
            case "State":
            case "Central":
            case "admin":
                account = await Admin.findById(decoded.id).select('-password')     
                break;
            default:
               return res.status(404).json({success: false, message: "Invalid Role"})
        }

        if(!account){
            return res.status(404).json({success: false, message: "Session expired"})
        }

        req.user = account;
        req.role = decoded.role;
        req.userId = decoded.id
        next();
        
    } catch (error) {
        console.error(error.message)
        res.status(401).json({success: false, message: "Invalid Or Expired Token"})
    }
}


export default authMiddleware