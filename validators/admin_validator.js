const Joi = require('joi');

const login_admin = Joi.object({
    email: Joi.string().required().messages({
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
})

const verify_otp_admin_validotor = Joi.object({
    email: Joi.string().required().messages({
        'string.empty': 'email is required',
        'any.required': 'email is required',
    }),
    otp: Joi.string().required().messages({
        'string.empty': 'OTP is required',
        'any.required': 'OTP is required',
    }),
})

const update_admin_profile = Joi.object({
    name: Joi.string().allow(null).messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required',
    }),
    email: Joi.string().required().messages({
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
    profile_image_id: Joi.number().integer().allow(null).messages({
        'integer.empty': 'Profile image is required',
      
    }),
})
const Create_admin = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required',
    }),
    email: Joi.string().required().messages({
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
})
module.exports = {
    login_admin,
    verify_otp_admin_validotor,
    update_admin_profile,
    Create_admin
}