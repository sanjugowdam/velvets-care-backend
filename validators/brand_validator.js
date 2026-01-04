const Joi = require('joi');

const createBrandValidator = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Brand name is required',
        'any.required': 'Brand name is required',
    }),
    description: Joi.string().allow('', null),
    slug: Joi.string().optional(),
    brand_image:Joi.any()
                .meta({ swaggerType: 'file' })
                .description('Brand image').messages({
                  'any.required': 'Image is required',
                }),
    is_active: Joi.boolean().default(true),
});

const updateBrandValidator = Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string().optional(),
    description: Joi.string().allow('', null),
    slug: Joi.string().optional(),
    brand_image:Joi.any()
                .meta({ swaggerType: 'file' })
                .description('Brand image').messages({
                  'any.required': 'Image is required',
                }),
    is_active: Joi.boolean().optional(),
});

const deleteBrandValidator = Joi.object({
    id: Joi.number().integer().required(),
});

const fetchAdminBrandValidator = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('', null),
});

const fetchUserBrandValidator = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().allow('', null),
});

const fetchSingleBrandValidator = Joi.object({
    id: Joi.number().integer().required(),
});

module.exports = {
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator,
    fetchAdminBrandValidator,
    fetchUserBrandValidator,
    fetchSingleBrandValidator
};
