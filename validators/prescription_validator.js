const Joi = require('joi');

const DoctorUploadPrescriptionToUserValidator = Joi.object({
    user_id: Joi.number().integer().required().messages({
        'number.base': 'User ID must be a number',
        'any.required': 'User ID is required',
    }),
    prescription_name: Joi.string().required().messages({
        'string.empty': 'Prescription name cannot be empty',
        'any.required': 'Prescription name is required',
    }),
    file: Joi.any()
        .meta({ swaggerType: 'file' })
        .description('Prescription file')
        .required()
        .messages({
            'any.required': 'Prescription file is required',
        }),
});


const DoctorUploadPrescriptionSelfValidator = Joi.object({
    prescription_name: Joi.string().required().messages({
        'string.empty': 'Prescription name cannot be empty',
        'any.required': 'Prescription name is required',
    }),
    file: Joi.any()
        .meta({ swaggerType: 'file' })
        .description('Prescription file')
        .required()
        .messages({
            'any.required': 'Prescription file is required',
        }),
});


const AdminUploadPrescriptionForUserValidator = Joi.object({
    user_id: Joi.number().integer().required().messages({
        'number.base': 'User ID must be a number',
        'any.required': 'User ID is required',
    }),
    doctor_id: Joi.number().integer().allow(null).messages({
        'number.base': 'Doctor ID must be a number',
    }),
    prescription_name: Joi.string().required().messages({
        'string.empty': 'Prescription name cannot be empty',
        'any.required': 'Prescription name is required',
    }),
    file: Joi.any()
        .meta({ swaggerType: 'file' })
        .description('Prescription file')
        .required()
        .messages({
            'any.required': 'Prescription file is required',
        }),
});


const UserUploadPrescriptionValidator = Joi.object({
    prescription_name: Joi.string().required().messages({
        'string.empty': 'Prescription name cannot be empty',
        'any.required': 'Prescription name is required',
    }),
    file: Joi.any()
        .meta({ swaggerType: 'file' })
        .description('Prescription file')
        .required()
        .messages({
            'any.required': 'Prescription file is required',
        }),
});


const UserFetchPrescriptionsValidator = Joi.object({
    page: Joi.number().integer().allow(null).messages({
        'number.base': 'Page must be a number',
    }),
    limit: Joi.number().integer().required().messages({
        'number.base': 'Limit must be a number',
        'any.required': 'Limit is required',
    }),
    search: Joi.string().allow(null).messages({
        'string.empty': 'Search cannot be empty',
    }),
    doctor_id: Joi.number().integer().allow(null).messages({
        'number.base': 'Doctor ID must be a number',
    }),
});

const DoctorFetchPrescriptionsValidator = Joi.object({
    page: Joi.number().integer().allow(null).messages({
        'number.base': 'Page must be a number',
    }),
    limit: Joi.number().integer().required().messages({
        'number.base': 'Limit must be a number',
        'any.required': 'Limit is required',
    }),
    user_id: Joi.number().integer().allow(null).messages({
        'number.base': 'User ID must be a number',
    }),
    from_date: Joi.date().allow(null),
    to_date: Joi.date().allow(null),
});

const AdminFetchPrescriptionsValidator = Joi.object({
    page: Joi.number().integer().allow(null).messages({
        'number.base': 'Page must be a number',
    }),
    limit: Joi.number().integer().required().messages({
        'number.base': 'Limit must be a number',
        'any.required': 'Limit is required',
    }),
    search: Joi.string().allow(null).messages({
        'string.empty': 'Search cannot be empty',
    }),
    doctor_id: Joi.number().integer().allow(null).messages({
        'number.base': 'Doctor ID must be a number',
    }),
    user_id: Joi.number().integer().allow(null).messages({
        'number.base': 'User ID must be a number',
    }),
});

const DeletePrescriptionValidator = Joi.object({
    id: Joi.number().integer().required().messages({
        'number.base': 'Prescription ID must be a number',
        'any.required': 'Prescription ID is required',
    }),
});

const UpdatePrescriptionValidator = Joi.object({
    prescription_name: Joi.string().optional().messages({
        'string.empty': 'Prescription name cannot be empty',
    }),
    file: Joi.any()
        .meta({ swaggerType: 'file' })
        .description('Prescription file')
        .optional(),
});

module.exports = {
    DoctorUploadPrescriptionToUserValidator,
    DoctorUploadPrescriptionSelfValidator,
    AdminUploadPrescriptionForUserValidator,
    UserUploadPrescriptionValidator,
    UserFetchPrescriptionsValidator,
    DoctorFetchPrescriptionsValidator,
    AdminFetchPrescriptionsValidator,
    DeletePrescriptionValidator,
    UpdatePrescriptionValidator
};
