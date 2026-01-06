/* Server/config/nodemailer.js */
import nodemailer from 'nodemailer';
import 'dotenv/config';

// 1. Validation Check
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("❌ SMTP Error: Missing SMTP_USER or SMTP_PASS in .env");
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com', // Default fallback
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: parseInt(process.env.SMTP_PORT) === 465, // True for 465, False for others
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// 2. Verify Connection (Clean Log)
transporter.verify((error, success) => {
    if (error) {
        console.error(`❌ SMTP Connection Error (${process.env.SMTP_HOST}):`, error.message);
    } else {
        console.log("✅ SMTP Server is Ready");
    }
});

export default transporter;