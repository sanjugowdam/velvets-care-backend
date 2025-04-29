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
    profile_image: Joi.any()
      .meta({ swaggerType: 'file' })
      .description('Image file of the QR code/barcode')
      .required().messages({
        'any.required': 'Image is required',
        'string.empty': 'Image is required',
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

const get_user_list = Joi.object({
    page: Joi.number().required().messages({
        'string.empty': 'Page is required',
        'any.required': 'Page is required',
    }),
    limit: Joi.number().required().messages({
        'string.empty': 'Limit is required',
        'any.required': 'Limit is required',
    }),
    searchquery: Joi.string().allow(null).messages({
        'string.empty': 'Search query is required',
    }),
})

module.exports = {
    login_user,
    update_user_profile,
    verify_otp_validator: verify_otp,
    logout_user,
    user_refresh_token_validator,
    get_user_list

}