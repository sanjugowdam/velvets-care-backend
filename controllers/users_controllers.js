const {
    Users,
    Otps
} = require('../models')
const {
    Op
} = require('sequelize')
const {
    OTPFunctions, JWTFunctions
} = require('../helpers')

const { sendOtpViaTwilio } = require('../helpers/twilio')

const request_otp = async (req, res) => {
    try {

        const { phone } = req.payload;
        const user = await Users.findOne({
            where: {
                phone: phone
            },
            raw: true
        })
        const otp = await OTPFunctions.getOTPByLength(4);
        if (!user) {
            const otpCode = await Otps.create({
                otp: otp,
                otp_time: Date.now()
            })
            await sendOtpViaTwilio(phone, otpCode.otp);
            await Users.create({
                phone: phone,
                otp_id: otpCode.id
            })
            return res.response({
                success: true,
                message: 'OTP sent successfully',
            })
        }
        const otpCode = await Otps.create({
            otp: otp,
            otp_time: Date.now()
        })
        await sendOtpViaTwilio(phone, otpCode.otp);
        await Users.update({
            otp_id: otpCode.id
        }, {
            where: {
                id: user.id
            }
        })
        return res.response({
            success: true,
            message: 'OTP sent successfully',
        })
    }
    catch (error) {
        console.log(error);
        return res.response({
            success: true,
            message: error.message,
        })

    }
}
const verify_otp = async (req, res) => {
    try {
        const { phone, otp } = req.payload;
        const user = await Users.findOne({
            where: {
                phone: phone
            },
            raw: true
        })
        if (!user) {
            return res.response({
                success: false,
                message: 'User not found',
            })
        }
        const otpCode = await Otps.findOne({
            where: {
                id: user.otp_id
            },
            raw: true
        })
        const otpTime = new Date(otpCode.otp_time);
        const currentTime = new Date();

        // Check if OTP is older than 10 minutes
        const diffInMinutes = (currentTime - otpTime) / 1000 / 60;

        if (diffInMinutes > 10) {
            return res.response({
                success: false,
                message: 'OTP has expired. Please request a new one.',
            });
        }
        if (otpCode.otp != otp) {
            return res.response({
                success: false,
                message: 'Invalid OTP',
            })
        }
        const payload = {
            user_id: user.id,
            phone: user.phone,
            name: user.name
        }
        const refresh_token = await JWTFunctions.generateToken(payload, '1d');
        const access_token = await JWTFunctions.generateToken(payload, '30d');
        await user.update({
            access_token: access_token,
            refresh_token: refresh_token
        }, {
            where: {
                id: user.id
            }
        })
        return res.response({
            success: true,
            message: 'OTP verified successfully',
            data: {
                access_token: access_token,
                refresh_token: refresh_token,
                user: payload,
            }
        })
    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        })
    }
}

const validateusersession = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const user = await Users.findOne({
            where: { id: session_user.id, access_token: req.headers['authorization'] },
            raw: true,
            attributes: ['id', 'name', 'phone'],
        },
        )
        if (!user) {
            throw new Error('Session expired');
        }
        return res.response({
            success: true,
            message: 'Session validated',
            data: user,
        }).code(200);
    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
    }
}

const logout = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { refresh_token } = req.payload;
        if (!refresh_token) {
            throw new Error('Refresh token required');
        }
        const decoded = JWTFunctions.verifyToken(refresh_token);
        const user = await Users.findOne({ where: { id: decoded.id } });
        if (!user) {
            throw new Error('User not found');
        }
       
        await Users.update({
            access_token: null,
            refresh_token: null,
        }, {
            where: {
                id: session_user.id
            }
        })
        return res.response({
            success: true,
            message: 'Logout successful',
        }).code(200);

    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
    }
}

const update_user = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
       const { name, phone, gender, profile_image_id, } = req.payload;
        return res.response({
            success: true,
            message: 'User updated successfully',
        }).code(200);
    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
    }
}
module.exports = {
    request_otp,
    verify_otp,
    validateusersession,
    logout,
}