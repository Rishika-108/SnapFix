import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Worker from '../models/gigWorkerModel.js'
import Admin from '../models/adminModel.js'
// Registers a citizen
const registerCitizen = async(req, res)=> {
    try {
        const {name, email, password} = req.body
        const hashedPassword = await bcrypt.hash(password,8) 

        const existing = await User.findOne({email})
        if(existing) return res.status(409).json({success: false, message: "User already registered"})

            const user = await User.create({
                name, email, password: hashedPassword, role: 'citizen'
            })
            res.status(201).json({success: true, message: "User registered successfully",
                user: {id: user._id, name: user.name, email: user.email, role: user.role}
            })
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: "Could not register the user"})
    }
}

//Logs In a Citizen
const loginCitizen = async(req, res)=> {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})
        if(!user || !(await bcrypt.compare(password, user.password)))
            return res.status(400).json({success: false, message: "Invalid Credentials"})

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1d"})
        res.status(200).json({success: true, message: "Successfully Logged In", token,
            user:{id: user._id, name: user.name, email: user.email, role: user.role}
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({sucess: false, message: 'Could not login the user'})
    }
}

// Register the gig worker
const registerWorker = async (req, res) => {
    try {
        const {name, email, password, phone, skills, latitude, longitude} = req.body;

        
        if(!latitude || !longitude){
            return res.status(400).json({success: false, message: "Location is missing"})
        } 
        const hashedPassword =await bcrypt.hash(password, 8)
        const  existing = await Worker.findOne({email})
        if(existing) return res.status(409).json({success: false, message: "User already registered"})
   

            const worker = await Worker.create({
                name, email, password: hashedPassword, phone, skills, role: 'gigworker', 
                approvedStatus: 'Pending', 
                location : {
                type: 'Point',
                coordinates : [longitude, latitude]
            }
            })
            res.status(201).json({success: true, message: "User registered successfully",
                worker:{id: worker._id, name: worker.name, email: worker.email, phone:worker.phone,
                    skills: worker.skills, role: worker.role, location: worker.location
                 }
            })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: "Cannot register the gig worker"})
    }
}

// Login a Gig Worker
const loginWorker = async (req,res) => {
    try {
        const {email, password} = req.body;
        const worker = await Worker.findOne({email})
        if(!worker || !(await bcrypt.compare(password, worker.password)))
            return res.status(400).json({success: false, message: "Invalid Credentials"})

        const token = jwt.sign({id: worker._id, role: worker.role},process.env.JWT_SECRET, {expiresIn: "1d"})
        res.status(200).json({
            success: true, message: "Logged In Successfully", token, 
            worker:{id: worker._id, name: worker.name, email: worker.email, skills: worker.skills, 
                phone: worker.phone, role: worker.role}
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: "Login unsuccessful"})
    }
}

// Admin Login
const loginAdmin = async (req,res) => {
    try {
        const {email, password } = req.body
        if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD)
            return res.status(400).json({success: false, message: "Invalid credentials"})

        let admin = await Admin.findOne({email: process.env.ADMIN_EMAIL})
        if(!admin) 
            await Admin.create({
            email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, role: "Local"
        })
        
        const token = jwt.sign({id: admin._id, email, role: "Local"}, process.env.JWT_SECRET, {expiresIn:"1d"})
        res.status(200).json({success: true, message: "Logged In Successfully", token, role: admin.role})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success: false, message: "Login Unsuccessful"})
    }
}

export {registerCitizen, loginCitizen, registerWorker, loginWorker, loginAdmin}