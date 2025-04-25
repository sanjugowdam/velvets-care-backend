const twilio = require('twilio');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Send OTP using Twilio
 * @param {string} phone - recipient phone number
 * @param {string} otp - the OTP code to send
 */
const sendOtpViaTwilio = async (phone, otp) => {
  return await client.messages.create({
    body: `Your verification code is: ${otp}`,
    from: process.env.TWILIO_PHONE,
    to: phone,
  });
};

module.exports = {
  sendOtpViaTwilio,
};
