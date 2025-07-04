const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path if necessary

const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {
            // Extract the token from "Bearer <token>"
            token = token.split(" ")[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user from the DB and exclude password
            req.user = await User.findById(decoded.id).select("-password");

            next(); // Pass control to the next middleware/route
        } else {
            return res.status(401).json({ message: "Not Authorized, no token found" });
        }

    } catch (error) {
        return res.status(401).json({
            message: "Token verification failed",
            error: error.message
        });
    }
};


//middleware for admin only

const adminOnly=(req,res,next) =>
{
    if(req.user && req.user.role === 'admin')
{
    next();  //pass control to the next middleware
}   
     else{
        return res.status(403).json({message:"Access Denied: Admins Only"});
     }
};

module.exports = {protect,adminOnly};
