const Joi = require('joi');

const CreateSpecializationValidator = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Specialization name cannot be empty',
        'any.required': 'Specialization name is required',
    }),
    icon: Joi.any()
            .meta({ swaggerType: 'file' })
            .description('Specialization image').messages({
              'any.required': 'Image is required',
            }),
});

const UpdateSpecializationValidator = Joi.object({
    id: Joi.number().integer().required().messages({
        'number.base': 'ID must be a number',
        'any.required': 'ID is required',
    }),
    name: Joi.string().optional().messages({
        'string.empty': 'Specialization name cannot be empty',
    }),
    icon: Joi.any()
            .meta({ swaggerType: 'file' })
            .description('Specialization image').optional().messages({
              'any.required': 'Image is required',
            }),
});
const DeleteSpecializationValidator = Joi.object({
    id: Joi.number().integer().required().messages({
        'number.base': 'ID must be a number',
        'any.required': 'ID is required',
    }),
});
const getadminspecialization = Joi.object({
    page: Joi.number().integer().allow(null).messages({
        'string.empty': 'Page is required',
        'any.required': 'Page is required',
    }),
    limit: Joi.number().integer().allow(null).messages({
        'string.empty': 'Limit is required',
        'any.required': 'Limit is required',
    }),
    search: Joi.string().allow(null).messages({
        'string.empty': 'Search term is required',
        'any.required': 'Search term is required',
    }),
});


module.exports = {
    CreateSpecializationValidator,
    UpdateSpecializationValidator,
    DeleteSpecializationValidator,
    getadminspecialization
};