import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

transporter.verify((err,success)=>{
    if(err){
        console.log("VERIFY ERROR:",err)
    } else{
        console.log("SMTP READY");
    }
});
export default transporter