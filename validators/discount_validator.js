const Joi = require('joi');

const create_discount_validator = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Discount name is required',
        'any.required': 'Discount name is required',
    }),
    code: Joi.string().required().messages({
        'string.empty': 'Discount code is required',
        'any.required': 'Discount code is required',
    }),
    type: Joi.string().valid('flat', 'percentage').required().messages({
        'string.empty': 'Discount type is required',
        'any.required': 'Discount type is required',
        'any.only': 'Discount type must be flat or percentage'
    }),
    value: Joi.number().required().messages({
        'number.empty': 'Discount value is required',
        'any.required': 'Discount value is required',
    }),
    start_date: Joi.date().required().messages({
        'date.base': 'Start date is required',
        'any.required': 'Start date is required',
    }),
    end_date: Joi.date().required().messages({
        'date.base': 'End date is required',
        'any.required': 'End date is required',
    }),
    usage_limit: Joi.number().required().messages({
        'number.empty': 'Usage limit is required',
        'any.required': 'Usage limit is required',
    }),
    is_active: Joi.boolean().required().messages({
        'boolean.base': 'is_active must be true or false',
        'any.required': 'is_active is required',
    }),
});

const update_discount_validator = Joi.object({
    name: Joi.string().allow(null),
    code: Joi.string().allow(null),
    type: Joi.string().valid('flat', 'percentage').allow(null),
    value: Joi.number().allow(null),
    start_date: Joi.date().allow(null),
    end_date: Joi.date().allow(null),
    usage_limit: Joi.number().allow(null),
    is_active: Joi.boolean().allow(null),
}).unknown();

const assign_discount_to_product_validator = Joi.object({
    discount_id: Joi.number().required().messages({
        'any.required': 'Discount ID is required',
    }),
    product_id: Joi.number().required().messages({
        'any.required': 'Product ID is required',
    }),
    usage_limit: Joi.number().allow(null),
});

const assign_discount_to_user_validator = Joi.object({
    discount_id: Joi.number().required().messages({
        'any.required': 'Discount ID is required',
    }),
    user_id: Joi.number().required().messages({
        'any.required': 'User ID is required',
    }),
});

const validate_discount_usage_validator = Joi.object({
    discount_code: Joi.string().required().messages({
        'any.required': 'Discount code is required',
    }),
    user_id: Joi.number().required().messages({
        'any.required': 'User ID is required',
    }),
    product_id: Joi.number().required().messages({
        'any.required': 'Product ID is required',
    }),
});

const fetch_single_discount_validator = Joi.object({
    id: Joi.number().required().messages({
        'any.required': 'Discount ID is required',
    }),
});

module.exports = {
    create_discount_validator,
    update_discount_validator,
    assign_discount_to_product_validator,
    assign_discount_to_user_validator,
    validate_discount_usage_validator,
    fetch_single_discount_validator
};
