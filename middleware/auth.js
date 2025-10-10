const supabase = require('../utils/supabaseclient')

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

        // supabase token auth
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error) throw error;

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
            username: user.username_metadata?.username || user.email
        };
        
        next();
    }catch(error){
        console.error("Auth Middleware error: ", error)
        
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({
                success: false,
                message: "Please login again"
            });
        }

        res.status(401).json({
            success:false,
            message: "Authentication failed"
        });
        
    }
}

module.exports = authMiddleware;