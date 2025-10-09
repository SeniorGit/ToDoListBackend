const bcrypt= require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel")

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
        const existingUser = await User.findByEmail(email);
        if (existingUser){
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            })
        }


        // hash and salting password
        const saltRound = 8;
        const password_hash = await bcrypt.hash(password, saltRound);

        // send to DB
        const newUser = await User.create({
            email: email,
            password_hash: password_hash,
            username: username || null
        })

        // send data to frontend
        res.status(201).json({
            success: true, 
            message: "Register Success", 
            data:{
                user:{
                    id: newUser.id,
                    email: newUser.email,
                    username: newUser.username
                },
            }
        })

    }catch(error){
        console.error("Error in Register", error)

        res.status(500).json({
            success: false, 
            message: "We're experiencing technical issues. Please try again later." ,
            error: process.env.NODE_ENV === "development" ? error.message: undefined
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

        // Search user Email
        const user = await User.findByEmail(email);
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            });
        }

        // Password Validation
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if(!isPasswordValid){
            return res.status(401).json({
                success:false, 
                message: "Invalid email or password"
            });
        }

        // generate token for SignIn
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )

        // success responese
        res.json({
            success: true,
            message: "Login Successful",
            data: {
                user:{
                    id: user.id,
                    email: user.email,
                    username: user.username
                },
                token: token
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
        const id = req.user.id;
        const {email, username} = req.body;
        const result = await User.updateProfile(id, {email, username});

        res.json({
            success: true, 
            message: "Profile update successfully",
            data: result
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
        const id = req.user.id;
        const {currentPassword, newPassword} = req.body;

        // Validasi input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required"
            });
        }

        //searching user by id  
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Validation
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
        if(!isCurrentPasswordValid){
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            })
        }

        // Valdiatin new password
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }

        // hash password
        const saltRound = 8;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRound);

        const result = await User.updatePassword(id, newPasswordHash);
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
        const id = req.user.id;
        const result = await User.deleteAccount(id);
        
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