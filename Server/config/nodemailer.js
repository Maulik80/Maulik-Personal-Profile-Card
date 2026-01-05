import nodemailer from 'nodemailer';
import 'dotenv/config'; // Loads environment variables

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports like 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ Brevo SMTP Error:", error);
    } else {
        console.log("✅ Brevo SMTP is ready to send emails");
    }
});

export default transporter;