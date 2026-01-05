import nodemailer from 'nodemailer';
import 'dotenv/config'; 

// Debugging Logs (આ તમને કન્સોલમાં બતાવશે કે ક્રેડેન્શિયલ લોડ થયા કે નહીં)
console.log("User:", process.env.SMTP_USER);
console.log("Pass:", process.env.SMTP_PASS ? "Yes (Loaded)" : "No (Missing!)");

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
        // ✅ સાચી જગ્યા: error અહીં જ મળે
        console.log(`❌ SMTP Error (${process.env.SMTP_HOST}):`, error);
    } else {
        console.log("✅ SMTP Server is ready to send emails");
    }
});

export default transporter;