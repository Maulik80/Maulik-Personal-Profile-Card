/* Server/config/nodemailer.js */
import nodemailer from 'nodemailer';
import 'dotenv/config';

// 1. Validation Check
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("❌ SMTP Error: Missing SMTP_USER or SMTP_PASS in .env");
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com', // Brevo Host
    port: parseInt(process.env.SMTP_PORT || '587'), // Brevo uses 587
    secure: false, // Must be false for Port 587 (It uses STARTTLS automatically)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    // Keep these settings for stability on Render
    family: 4, 
    connectionTimeout: 10000,
});

// 2. Verify Connection
transporter.verify((error, success) => {
    if (error) {
        console.error(`❌ SMTP Connection Error (${process.env.SMTP_HOST}):`, error.message);
    } else {
        console.log("✅ Brevo SMTP Server is Ready");
    }
});

export default transporter;