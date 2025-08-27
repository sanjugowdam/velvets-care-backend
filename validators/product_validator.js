const Joi = require('joi');

const createProductValidator = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Product name is required',
        'any.required': 'Product name is required',
    }),
    mrp_price: Joi.number().required().messages({
        'number.empty': 'MRP price is required',
        'any.required': 'MRP price is required',
    }),
    selling_price: Joi.number().required().messages({
        'number.empty': 'Selling price is required',
        'any.required': 'Selling price is required',
    }),
    sku: Joi.string().required().messages({
        'string.empty': 'SKU is required',
        'any.required': 'SKU is required',
    }),
    category_id: Joi.number().integer().required().messages({
        'number.empty': 'Category ID is required',
        'any.required': 'Category ID is required',
    }),
    sub_category_id: Joi.number().integer().allow(null).messages({
        'number.empty': 'Sub-category ID is required',
    }),
    brand_id: Joi.number().integer().required().messages({
        'number.empty': 'Brand ID is required',
        'any.required': 'Brand ID is required',
    }),
    tags: Joi.string().allow('', null),
    is_active: Joi.boolean().default(true),
    is_featured: Joi.boolean().default(false),
    is_new: Joi.boolean().default(false),
    stock: Joi.number().required().messages({
        'number.empty': 'Stock is required',
        'any.required': 'Stock is required',
    }),
    description: Joi.string().allow('', null),
});

const createimageValidator = Joi.object({
    product_id: Joi.number().integer().required().messages({
        'number.empty': 'Product ID is required',
        'any.required': 'Product ID is required',
    }),
    file: Joi.any()
                .meta({ swaggerType: 'file' })
                .description('Product image').messages({
                  'any.required': 'Image is required',
                }),
});

const fetchAdminProductValidator = Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
        'number.base': 'Page must be a number',
        'number.min': 'Page must be at least 1',
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
        'number.base': 'Limit must be a number',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit must not exceed 100',
    }),
    search: Joi.string().allow('', null),
    search: Joi.string().allow('', null),
    sort: Joi.string().valid('name', 'mrp_price', 'selling_price', 'created_at', 'updated_at').default('created_at').messages({
        'any.only': 'Sort must be one of name, mrp_price, selling_price, created_at, updated_at',
    }),
});

const fetchProductsUsersValidator = Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
        'number.base': 'Page must be a number',
        'number.min': 'Page must be at least 1',
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
        'number.base': 'Limit must be a number',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit must not exceed 100',
    }),
    search: Joi.string().allow('', null),
    sort: Joi.string().valid('name', 'mrp_price', 'selling_price', 'created_at', 'updated_at').default('created_at').messages({
        'any.only': 'Sort must be one of name, mrp_price, selling_price, created_at, updated_at',
    }),
});


module.exports = {
    createProductValidator,
    createimageValidator,
    fetchAdminProductValidator,
    fetchProductsUsersValidator
};
