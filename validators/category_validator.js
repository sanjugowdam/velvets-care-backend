const Joi = require('joi');

const createCategoryValidator = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Category name is required',
        'any.required': 'Category name is required',
    }),
    description: Joi.string().allow('', null),
    is_active: Joi.boolean().default(true),
});

const updateCategoryValidator = Joi.object({
    id: Joi.number().integer().required().messages({
        'any.required': 'Category ID is required',
    }),
    name: Joi.string().optional(),
    description: Joi.string().allow('', null),
    is_active: Joi.boolean().optional(),
});

const deleteCategoryValidator = Joi.object({
    id: Joi.number().integer().required().messages({
        'any.required': 'Category ID is required',
    }),
});

const fetchAdminCategoryValidator = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('', null),
});

const fetchUserCategoryValidator = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('', null),
});

const fetchSingleCategoryValidator = Joi.object({
    id: Joi.number().integer().required(),
});

module.exports = {
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator,
    fetchAdminCategoryValidator,
    fetchUserCategoryValidator,
    fetchSingleCategoryValidator
};
