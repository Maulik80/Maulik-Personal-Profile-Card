import nodemailer from 'nodemailer';
import 'dotenv/config';

// 1. Validation Check
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("❌ SMTP Error: Missing SMTP_USER or SMTP_PASS in .env");
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'), // Default to 465 (Secure)
    secure: parseInt(process.env.SMTP_PORT || '465') === 465, // True if 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    // 👇 આ મહત્વનું છે (Timeout Fixes)
    family: 4, // Force IPv4 (Gmail ઘણીવાર IPv6 માં ટાઈમઆઉટ આપે છે)
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000
});

// 2. Verify Connection (Non-blocking)
transporter.verify((error, success) => {
    if (error) {
        console.error(`❌ SMTP Connection Error (${process.env.SMTP_HOST}):`, error.message);
    } else {
        console.log("✅ SMTP Server is Ready");
    }
});

export default transporter;