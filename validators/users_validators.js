const Joi = require('joi');

const login_user = Joi.object({
    phone: Joi.string().required().messages({
        'string.empty': 'Phone number is required',
        'any.required': 'Phone number is required',
    }),
})

const verify_otp = Joi.object({
    phone: Joi.string().required().messages({
        'string.empty': 'Phone number is required',
        'any.required': 'Phone number is required',
    }),
    otp: Joi.string().required().messages({
        'string.empty': 'OTP is required',
        'any.required': 'OTP is required',
    }),
})

const update_user_profile = Joi.object({
    name: Joi.string().allow(null).messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required',
    }),
    phone: Joi.string().required().messages({
        'string.empty': 'Phone number is required',
        'any.required': 'Phone number is required',
    }),
    gender: Joi.string().allow(null).messages({
        'string.empty': 'Gender is required',
        'any.required': 'Gender is required',
    }),
    dob: Joi.string().allow(null).messages({
        'string.empty': 'Date of birth is required',
    }),
    profile_image_id: Joi.number().integer().allow(null).messages({
        'string.empty': 'Profile image is required',
    }),
})

const logout_user = Joi.object({
    refresh_token: Joi.string().required().messages({
        'string.empty': 'Refresh token is required',
        'any.required': 'Refresh token is required',
    }),
})
const user_refresh_token_validator = Joi.object({
    refresh_token: Joi.string().required().messages({
        'string.empty': 'Refresh token is required',
        'any.required': 'Refresh token is required',
    }),
}).unknown()

module.exports = {
    login_user,
    update_user_profile,
    verify_otp_validator: verify_otp,
    logout_user,
    user_refresh_token_validator
}