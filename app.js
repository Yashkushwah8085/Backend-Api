import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mailRoutes from "./routes/mail.route.js"
import authRoutes from "./routes/auth.route.js"
import notificationRoutes from "./routes/notification.route.js"
import paymentRoutes from './routes/payment.route.js'
import connectDB from "./config/db.js"

dotenv.config();

connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/mail",mailRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/user",authRoutes)
app.use("/api/notification",notificationRoutes)
app.use("/api/payment",paymentRoutes);

app.listen(3000)
console.log("server at link http://localhost:3000")