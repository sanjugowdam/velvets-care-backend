const { Users, Doctors } = require('../models');

const saveFcmToken = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { fcm_token } = req.payload;

  if (!fcm_token) return res.response({ success: false, message: 'Token required' }).code(400);

  if (session_user.user_id) {
    await Users.update({ fcm_token }, { where: { id: session_user.user_id } });
  } else if (session_user.doctor_id) {
    await Doctors.update({ fcm_token }, { where: { id: session_user.doctor_id } });
  }

  return res.response({ success: true, message: 'Token saved' }).code(200);
} catch (error) {
  console.error('Error saving FCM token:', error);
  return res.response({ success: false, message: error.message }).code(500);
}
};
module.exports = {
  saveFcmToken,
};