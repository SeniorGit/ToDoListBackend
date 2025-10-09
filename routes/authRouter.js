const express = require('express');
const authRouter = express.Router();
const authController = require("../controllers/authController")
const authMiddleware = require("../middleware/auth")

// router + middleware + the controller 
authRouter.post("/register", authController.register)
authRouter.post("/login", authController.login)
authRouter.post("/logout", authController.logOut)
authRouter.get("/me", authMiddleware, (req, res)=>{
    res.json({
        success:true,
        data:{
            user: req.user
        }
    })
})
authRouter.put("/profile", authMiddleware, authController.changePro)
authRouter.put("/password", authMiddleware, authController.changePass)
authRouter.delete("/account", authMiddleware, authController.delete)

module.exports = authRouter;