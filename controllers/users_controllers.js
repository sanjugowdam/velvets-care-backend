const {
    Users,
    Otps,
    Files
} = require('../models')
const {
    Op
} = require('sequelize')
const {
    OTPFunctions, JWTFunctions
} = require('../helpers')

const { TwilioFunctions, FileFunctions } = require('../helpers')

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
        console.log("login otp:", otp);
        if (!user) {
            const otpCode = await Otps.create({
                otp: otp,
                otp_time: Date.now()
            })
            const sent = await TwilioFunctions.sendOtpViaTwilio(phone, otpCode.otp);
            if (!sent) {
                throw new Error('OTP not sent');
            }
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
        const sent = await TwilioFunctions.sendOtpViaTwilio(phone, otpCode.otp);
        if (!sent) {
            throw new Error('OTP not sent');
        }
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
        await Users.update({
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
        console.log(session_user, "session checker");
        const user = await Users.findOne({
            where: { id: session_user.user_id, access_token: req.headers['authorization'] },
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
        const user = await Users.findOne({ where: { id: decoded.user_id } });
        if (!user) {
            throw new Error('User not found');
        }

        await Users.update({
            access_token: null,
            refresh_token: null,
        }, {
            where: {
                id: session_user.user_id
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
        const { name, phone, gender, profile_image, dob} = req.payload;
        const user = await Users.findOne({ where: { id: session_user.user_id} });
        if (!user) {
            throw new Error('User not found');
        }
        const storePath = await FileFunctions.uploadFile(req, profile_image, './uploads/profiles');
        const uploadedImage = await FileFunctions.uploadFile(req, image, storePath);
        const uploaded_files = await Files.create({
            file_url: uploadedImage.file_url,
            extension: uploadedImage.extension,
            original_name: uploadedImage.original_name,
            size: uploadedImage.size
        })
        await Users.update({
            name: name,
            phone: phone,
            gender: gender,
            dob: dob,
            profile_image_id: uploaded_files.id,
        }, {
            where: {
                id: session_user.user_id
            }
        })
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
const user_refresh_token = async (req, res) => {
    try {
        const { refresh_token } = req.headers;
        if (!refresh_token) {
            throw new Error('Refresh token required');
        }
        const decoded = JWTFunctions.verifyToken(refresh_token);
        const user = await Users.findOne({ where: { id: decoded.user_id } });
        if (!user) {
            throw new Error('User not found');
        }
        const payload = {
            user_id: user.id,
            phone: user.phone,
            name: user.name
        }
        const access_token = await JWTFunctions.generateToken( payload , '1d');
        const new_refresh_token = await JWTFunctions.generateToken( payload , '30d');
        await Users.update({
            access_token: access_token,
            refresh_token: new_refresh_token
        }, {
            where: {
                id: decoded.user_id
            }
        }
        )
        return res.response({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                access_token: access_token,
                refresh_token: new_refresh_token,
                user: payload
            }
        }).code(200);
    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
    }
}

const getusers = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const {page, limit, searchquery} = req.qeury;
       let  filter = {};
        if (searchquery) {
            filter = {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${searchquery}%` } },
                    { phone: { [Op.iLike]: `%${searchquery}%` } },
                ],
            };
        }
        const user_count = await Users.findAndCountAll({
            where: filter
        });
        const users = await Users.findAll({
            where: filter,
            limit: limit,
            offset: (page - 1) * limit,
        });
        return res.response({
            success: true,
            message: 'Users fetched successfully',
            data: users,
            total: user_count.count,
            page: page,
            limit: limit,
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
    update_user,
    user_refresh_token,
    getusers
    
}