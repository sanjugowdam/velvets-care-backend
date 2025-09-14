const Joi = require('joi');

const create_discounted_user_validator = Joi.object({
    user_id: Joi.number().required().messages({
        'any.required': 'User ID is required',
    }),
    discount_id: Joi.number().required().messages({
        'any.required': 'Discount ID is required',
    }),
});

const update_discounted_user_validator = Joi.object({
    user_id: Joi.number().allow(null),
    discount_id: Joi.number().allow(null),
    used_count: Joi.number().allow(null),
}).unknown();

const get_discounted_users_validator = Joi.object({
    page: Joi.number().required().messages({
        'any.required': 'Page is required',
    }),
    limit: Joi.number().allow(null),
});

module.exports = {
    create_discounted_user_validator,
    update_discounted_user_validator,
    get_discounted_users_validator,
};
