require('dotenv').config();

module.exports = {
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    DB_NAME: process.env.DB_NAME,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    TWILIO_SID: process.env.TWILIO_SID,
    TWILIO_TOKEN: process.env.TWILIO_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
    GOOGLE_API_KEY : process.env.GOOGLE_API_KEY,
    YOUTUBE_CHANNEL_ID : process.env.YOUTUBE_CHANNEL_ID,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_SECRET: process.env.RAZORPAY_SECRET
}; 