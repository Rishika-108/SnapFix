import User from "../models/userModel.js"

const myReports = async (req, res) => {
    try {
        const userId = req.user?._id
        if (!userId) return res.status(400).json({ success: false, message: "User not logged in or authorised" })

        const user = await User.findById(userId)
            .populate({
                path: 'reports',
                select: 'title description imageUrl category upvotes status createdAt '
            })
            .populate({
                path: 'upvotedReports',
                select: 'title description imageUrl category upvotes status createdAt '
            })
            .select('reports upvotedReports')

        if (!user) return res.status(400).json({ success: false, message: 'user not found' })

        const { reports, upvotedReports } = user
        if(reports.length === 0 && upvotedReports.length === 0){
            return res.status(400).json({success: false, message: "You havent reported any issue yet"})
        }

        res.status(200).json({ success: true, message: 'Successfully fetched user reports', reports, upvotedReports })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Could not fetch your reports" })
    }

}

export { myReports }