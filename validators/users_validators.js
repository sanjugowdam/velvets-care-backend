const Joi = require('joi');
const list_users_query = Joi.object({
    page: Joi.number().allow(null).messages({
        "number.empty": "Page is required",
    }),
    limit: Joi.number().allow(null).messages({
        "number.empty": "Limit is required",
    }),
    sort_by: Joi.string().allow(null).valid('name', 'phone').messages({
        'string.empty': 'Sort is required',
    }),
    order: Joi.string().allow(null).valid('asc', 'desc').messages({
        'string.empty': 'Order is required',
    }),
    search: Joi.string().allow(null).messages({
        'string.empty': 'Search is required',
    }),
})

const register_login_user_and_send_otp_payload = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required',
    }),
    phone: Joi.string().required().messages({
        'string.empty': 'Phone is required',
        'any.required': 'Phone is required',
    }),
})
const register_login_user_otp_verification_payload = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required',
    }),
    phone: Joi.string().required().messages({
        'string.empty': 'Phone is required',
        'any.required': 'Phone is required',
    }),
    otp: Joi.string().required().messages({
        'string.empty': 'OTP is required',
        'any.required': 'OTP is required',
    }),
})

module.exports = {
    list_users_query,
    register_login_user_otp_verification_payload,
    register_login_user_and_send_otp_payload
}