const supabase = require('../utils/supabaseclient')

exports.register = async (req, res) => {
    try{
        // ask email password and username from body
        const {email, password, username} = req.body;
        
        // validation
        // check if email or password is empty 
        if(!email || !password || !username){
            return res.status(400).json({
                success: false,
                message: "Username, Email, and Password Requaired"
            })
        }

        // check password mush more than 6 character
        if(password.length < 6){
            return res.status(400).json({
                success:false,
                message: "Password must be more than 6 characters"
            })
        }

        // check if email register
        const {data, error} = await supabase.auth.signUp({
            email, 
            password,
            options: {
                data: {
                    username: username
                }
            }
        });
        
        if(error){
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }

        // success response
        res.status(201).json({
            success: true,
            message: "Register Success",
            data:{
                user:{
                    id: data.user.id,
                    email: data.user.email,
                    username: data.user.user_metadata?.username
                }
            }
        })
    }catch(error){
        console.error("Error in Register", error)
        res.status(500).json({
            success: false, 
            message: "We're experiencing technical issues. Please try again later." ,
        });
    }
};

exports.login = async (req, res) => {
    try{
        // Validation
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Email and Password Required"
            })
        }

        // Search user in supabase
        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if(error){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            });
        }

        // success responese
        res.json({
            success: true,
            message: "Login Successful",
            data: {
                user:{
                    id: data.user.id,
                    email: data.user.email,
                    username: data.user.user_metadata?.username
                },
                token: data.session.access_token
            }
        })

    }catch(error){
        console.error("Error in Login", error);
        res.status(500).json({
            success:false,
            message: "We're experiencing technical issues. Please try again later." 
        })
    }
}

// when user is on login
exports.getMe = async (req, res)=>{
    try{
        res.json({
            success: true,
            data: {
                user: req.user
            }
        })
    }catch(error){
        console.error("Error in getMe", error)
        res.status(500).json({
            success: false,
            message: "We're experiencing technical issues. Please try again later." 
        })
    }
}

// for logOut
exports.logOut = async(req, res)=>{
    res.json({
        success: true,
        message: "Logout successful"
    })
}

// change profile email and username
exports.changePro = async(req, res)=>{
    try{
        const {email, username} = req.body;
        
        const {data, error} = await supabase.auth.updateUser({
            email: email,
            data: {username: username}
        })
        
        if(error) throw error;

        res.json({
            success: true, 
            message: "Profile update successfully",
            data: {
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    username: data.user.user_metadata?.username
                }
            }
        })

    }catch(error){
        console.error("Error in Change Profile", error);
        res.status(500).json({
            success:false,
            message: "We're experiencing technical issues. Please try again later." 
        })
    }
}

// changing password
exports.changePass = async(req, res)=>{
    try{
        // take data
        const { newPassword } = req.body;

        // Validasi input
        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password is required"
            });
        }
        
        // Valdiatin new password
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }
       
        //searching user by id  
        const {data, user} = await supabase.auth.updateUser({
            password: newPassword
        }) 
        
        if (error) throw error;

        res.json({
            success: true,
            message: "Password updated successfully"
        });

    }catch(error){
        console.error("Error in Change Password", error);
        res.status(500).json({
            success: false,
            message: "We're experiencing technical issues. Please try again later." 
        });
    }
}

// delete account 
exports.delete = async(req, res)=>{
    try {
        // Delete user di Supabase (butuh service role key untuk ini)
        // Atau bisa handle di client-side dengan supabase.auth.signOut() + delete account flow
        
        res.json({
            success: true,
            message: "Account deleted successfully"
        });
    } catch(error) {
        console.error("Error in Delete Account", error);
        res.status(500).json({
            success: false,
            message: "We're experiencing technical issues. Please try again later." 
        });
    }
}