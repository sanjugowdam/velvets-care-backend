const {
    Users
} = require('../models')
const {
    Op
} = require('sequelize')
const {
    OTPFunctions, JWTFunctions
} = require('../helpers')

const list_users = async (req, res) => {
    try {
        const {
            page,   // Can be null
            limit,  // Can be null
            sort_by,    // Can be null
            order,  // Can be null
            search, // Can be null
        } = req.query
        const filter = {
            where: {}
        }
        if (search) filter.where[Op.or] = [
            {
                name: {
                    [Op.like]: `%${search}%`
                }
            },
            {
                phone: {
                    [Op.like]: `%${search}%`
                }
            },
            {
                email: {
                    [Op.like]: `%${search}%`
                }
            }
        ]
        if (sort_by && order) filter.order = [[sort_by, order]]
        if (limit) filter.limit = limit
        if (page) filter.offset = (page - 1) * limit

        const users = await Users.findAll({
            ...filter,
            raw: true,
            attributes: [
                'id',
                'name',
                'email',
                'phone',
                'avatar_file_name',
                'avatar_file_url',
                'avatar_file_extension',
                'avatar_file_size',
                'verified',
                'banned',
            ]
        })

        return res.response({
            success: true,
            message: 'Users list fetched successfully',
            data: users
        }).code(200);
    } catch (error) {
        console.log('users_controllers.js @ Line 9:', error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
    }
}

const register_and_login_by_otp = async (req, res) => {
    try {
        const {
            name,
            phone,
        } = req.payload
        const available_user = await Users.findOne({
            where: {
                phone,
                name,
                banned: false
            },
            raw: true
        })

        const otp = OTPFunctions.getOTPByLength(7)
        console.log('users_controllers.js @ Line 77:', otp);
        if (!available_user) {
            await Users.create({
                name,
                phone,
                otp,
                otp_time: new Date().getTime(),
                verified: false,
                banned: false
            })
            return res.response({
                success: true,
                message: 'OTP Sent successfully',
            }).code(200);
        } else {
            await Users.update({
                otp,
                otp_time: new Date().getTime(),
                verified: false,
                access_token: null,
                refresh_token: null
            }, {
                where: {
                    id: available_user.id
                }
            })
            return res.response({
                success: true,
                message: 'OTP Sent successfully',
            }).code(200);
        }
    } catch (error) {
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
    }
}
const register_and_login_verify_otp = async (req, res) => {
    try {
        const {
            name,
            phone,
        } = req.payload
        const available_user = await Users.findOne({
            where: {
                phone,
                name,
            },
            raw: true
        })

        if (!available_user) {
            return res.response({
                success: false,
                message: 'User not found',
            }).code(200);
        } else if (available_user.banned) {
            return res.response({
                success: false,
                message: 'You are banned from using the application.',
            }).code(200);
        } else {
            const now = new Date().getTime();
            const savedTimestamp = Number(available_user.otp_time);
            const secondsPassed = Math.floor((now - savedTimestamp) / 1000);
            if (secondsPassed < 600) {
                if (available_user.otp == req.payload.otp) {
                    const user_data = {
                        id: available_user.id,
                        name: available_user.name,
                        phone: available_user.phone,
                        banned: available_user.banned,
                        verified: available_user.verified,
                        email: available_user.email,
                        avatar_file_name: available_user.avatar_file_name,
                        avatar_file_url: available_user.avatar_file_url,
                        avatar_file_extension: available_user.avatar_file_extension,
                        avatar_file_size: available_user.avatar_file_size,
                    }
                    const access_token = JWTFunctions.generateToken(user_data, '1d')
                    const refresh_token = JWTFunctions.generateToken(user_data, '7d')
                    await Users.update({
                        access_token,
                        refresh_token,
                        otp: null,
                        otp_time: null,
                        verified: true
                    }, {
                        where: {
                            id: available_user.id
                        }
                    })
                    return res.response({
                        success: true,
                        message: 'OTP verified successfully',
                        data: {
                            user: user_data,
                            access_token,
                            refresh_token
                        }
                    }).code(200);
                } else {
                    return res.response({
                        success: false,
                        message: 'Invalid OTP',
                    }).code(200);
                }
            } else {
                return res.response({
                    success: false,
                    message: 'OTP expired',
                }).code(200);
            }
        }
    } catch (error) {
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
    }
}

module.exports = {
    list_users,
    register_and_login_by_otp,
    register_and_login_verify_otp
}