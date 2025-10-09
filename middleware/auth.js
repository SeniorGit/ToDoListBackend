const jwt = require('jsonwebtoken');
const User = require('../model/userModel')

const authMiddleware = async (req, res, next) => {
    try{
        // take token from header & checking if there any token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }
        // extrax token and verivy
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Search Id from User 
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // add user to request Object
        req.user = {
            id: user.id,
            email: user.email,
            username: user.username
        };
        
        next();
    }catch(error){
        console.error("Auth Middleware error: ", error)
        if(error.name === 'JsonWebTokenError'){
            return res.status(401).json({
                success: false,
                message: "Authentication failed"
            });
        }

        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        res.status(500).json({
            success:false,
            message: "We're experiencing technical issues. Please try again later."
        });
        
    }
}

module.exports = authMiddleware;