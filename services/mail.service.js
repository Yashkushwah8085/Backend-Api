import transporter from "../config/mail.config.js";

export const sendMail = async({
    to,
    subject,
    html,
}) => {
    try{
        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject,
            html
        });
        return info
    } catch(error){
        throw error;
    }
};