import { sendMail } from "../services/mail.service.js";

export const sendMailController = async (req,res) =>{
    try {
        const {to,subject,message} = req.body;

        await sendMail({
            to,
            subject,
            html:`<h2>Hello User</h2>
            <p>${message}</p>`,
        });

        return res.status(200).json({
            success:true,
            message:"mail sent successfully"
        });
    } catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
};