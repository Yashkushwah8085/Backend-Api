import express from "express"
import { sendMailController } from "../conroller/mail.controller.js"

const router = express.Router()


router.post("/send",sendMailController)

export default router