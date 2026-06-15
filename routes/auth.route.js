import express from "express"
import { Register,Login,sendOtp,VerfiyOtp,forgetPassword,resetPassword,getProfile, updateProfile, changePassword, Logout, getAllUsers, DeleteUser } from "../conroller/auth.controller.js"
import { isAuthenticated } from "../middleware/auth.middleware.js"
import { isAdmin } from "../middleware/admin.middleware.js"
const router = express.Router()

router.post("/register",Register)
router.post("/login",Login)

router.post("/send-otp",sendOtp)
router.post("/verify-otp",VerfiyOtp)

router.post("/forget-password",forgetPassword)
router.post("/reset-password",resetPassword)

router.get("/profile",isAuthenticated,getProfile)
router.put("/update-profile",isAuthenticated,updateProfile)
router.put("/change-password",isAuthenticated,changePassword)
router.get("/users",isAuthenticated,isAdmin,getAllUsers)
router.delete("/user/:id",isAuthenticated,isAdmin,DeleteUser)
router.post("/logout",isAuthenticated,Logout)

export default router