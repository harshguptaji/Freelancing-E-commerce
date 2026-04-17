import nodemailer from "nodemailer";


// Create Transport
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send Email
export const sendEmail = async (email,sub,msg) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: sub,
            html: msg
        });
    } catch (error) {
        console.log(`Error - ${error}`);
    }
};