const Joi = require('joi');

const createSubCategoryValidator = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Subcategory name is required',
        'any.required': 'Subcategory name is required',
    }),
    category_id: Joi.number().integer().required().messages({
        'any.required': 'Category ID is required',
    }),
    description: Joi.string().allow('', null),
    is_active: Joi.boolean().default(true),
});

const updateSubCategoryValidator = Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string().optional(),
    category_id: Joi.number().integer().optional(),
    description: Joi.string().allow('', null),
    is_active: Joi.boolean().optional(),
});

const deleteSubCategoryValidator = Joi.object({
    id: Joi.number().integer().required(),
});

const fetchAdminSubCategoryValidator = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('', null),
});

const fetchUserSubCategoryValidator = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('', null),
});

const fetchSingleSubCategoryValidator = Joi.object({
    id: Joi.number().integer().required(),
});

module.exports = {
    createSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
    fetchAdminSubCategoryValidator,
    fetchUserSubCategoryValidator,
    fetchSingleSubCategoryValidator
};
