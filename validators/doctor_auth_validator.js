const Joi = require('joi');

const login_doctor = Joi.object({
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
const logout_doctor = Joi.object({
    refresh_token: Joi.string().required().messages({
        'string.empty': 'Refresh token is required',
        'any.required': 'Refresh token is required',
    }),
})
    const doctor_refresh_token_validator = Joi.object({
        refresh_token: Joi.string().required().messages({
            'string.empty': 'Refresh token is required',
            'any.required': 'Refresh token is required',
        }),
    }).unknown()
    
    const get_doctor_list = Joi.object({
        page: Joi.number().required().messages({
            'string.empty': 'Page is required',
            'any.required': 'Page is required',
        }),
        limit: Joi.number().allow(null).messages({
            'string.empty': 'Limit is required',
            'any.required': 'Limit is required',
        }),
        searchquery: Joi.string().allow(null).messages({
            'string.empty': 'Search query is required',
        }),
    })
    const update_doctor_profile = Joi.object({
        full_name: Joi.string().allow(null).messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required',
        }),
        gender: Joi.string().allow(null).messages({
            'string.empty': 'Gender is required',
            'any.required': 'Gender is required',
        }),
        date_of_birth: Joi.date().allow(null),
        phone: Joi.number().integer().required().messages({
            'any.required': 'Phone number is required',
        }),
        email: Joi.string().email().required().messages({
            'any.required': 'Email is required',
        }),
        profile_image: Joi.any()
          .meta({ swaggerType: 'file' })
          .description('Profile image').messages({
            'any.required': 'Image is required',
            'string.empty': 'Image is required',
          }),
    })
module.exports = {
    login_doctor,
    verify_otp,
    logout_doctor,
    get_doctor_list,
    doctor_refresh_token_validator,
    update_doctor_profile_validator
}