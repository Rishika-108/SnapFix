import Worker from "../models/gigWorkerModel.js"
import Report from "../models/reportModel.js"

// Customizes Worker's feed by showing issues only near his/her location
const getReportsByLocation = async (req, res) => {
    try {
        const userId = req.user?._id

        const worker = await Worker.findById(userId)
        if (!worker) res.status(404).json({ success: false, message: "User not found" })

        if (!worker.location || !Array.isArray(worker.location.coordinates)) {
            return res.status(400).json({ success: false, message: "Worker location not set" })
        }
        const[longitude, latitude] = worker.location.coordinates;
        const searchRadius = 5000;

        const nearByReports = await Report.find({
            location: {
                $near: {
                    $geometry : {type: "Point", coordinates: [longitude, latitude]},
                    $maxDistance: searchRadius,
                }
            },
            // status: {$in: ["Pending", "In Progress"]},
        })
        .populate("createdBy", "name email")
        .limit(50)

        res.status(200).json({success: true, message: "Fetched nearby reports",
            count: nearByReports.length,
            reports: nearByReports,
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Could not fetch location" })
    }



}

// Worker can view his own profile - Maybe we will need to change it in future for admin's pov - that
//admin can see the worker profile
const getWorkerProfile = async (req, res) => {
    try {
        if (req.role !== "gigworker")
            return res.status(403).json({ success: false, message: "Access Denied" })
        res.status(200).json({ success: true, worker: req.user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: true, message: "Could not fetch details" })
    }
}

export { getReportsByLocation, getWorkerProfile }