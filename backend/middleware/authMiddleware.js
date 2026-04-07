const jwt = require('jsonwebtoken')
const User = require('../models/User')

// middleware to protect route
// const protect = async (req, res, next) => {
//     let token;

//     if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
//         try{
//             token = req.headers.authorization.split(" ")[1]
//             const decoded = jwt.verify(token, process.env.JWT_SECRET)
//             req.user = await User.findById(decoded.user.id).select("-password") //exclude password
//             next()
//         }catch(error){
//             console.error("Token verification failed",error)
//             return res.status(401).json({messsage: "Not authorized, token failed"})
//         }
//     }else{
//         return res.status(401).json({message: "Not authorized, no token provided"})
//     }
// }
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Try common JWT payload structures
            const userId = decoded.id || (decoded.user && decoded.user.id);
            
            if (!userId) {
                return res.status(401).json({ message: "Invalid token payload" });
            }

            req.user = await User.findById(userId).select("-password");
            
            if (!req.user) {
                return res.status(401).json({ message: "User no longer exists" });
            }

            next();
        } catch (error) {
            console.error("Token verification failed", error);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }
};

//Midleware to check if user is an 
const admin = (req, res, next) => {
    if(req.user && req.user.role === "admin"){
        next()
    }else{
        res.status(403).json({message: "Not authorized as an admin"})
    }
}
module.exports = { protect, admin }