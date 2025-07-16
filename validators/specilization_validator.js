const Joi = require('joi');

const CreateSpecializationValidator = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Specialization name cannot be empty',
        'any.required': 'Specialization name is required',
    }),
});

const UpdateSpecializationValidator = Joi.object({
    name: Joi.string().optional().messages({
        'string.empty': 'Specialization name cannot be empty',
        'any.required': 'Specialization name is required',
    }),
});
const DeleteSpecializationValidator = Joi.object({
    id: Joi.number().integer().required().messages({
        'number.base': 'ID must be a number',
        'any.required': 'ID is required',
    }),
});
const GetSpecializationValidator = Joi.object({
    id: Joi.number().integer().required().messages({
        'number.base': 'ID must be a number',
        'any.required': 'ID is required',
    }),
});


module.exports = {
    CreateSpecializationValidator,
    UpdateSpecializationValidator,
    DeleteSpecializationValidator,
    GetSpecializationValidator
};