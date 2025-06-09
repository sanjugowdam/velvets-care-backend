const Joi = require('joi');

const appointmentValidator = Joi.object({
    appointment_time: Joi.string().required().messages({
        'string.empty': 'Date is required',
        'any.required': 'Date is required',
    }),
    doctor_id: Joi.number().required().messages({
        'number.empty': 'Doctor ID is required',
        'any.required': 'Doctor ID is required',
    }),
    patient_id: Joi.number().required().messages({
        'number.empty': 'Patient ID is required',
        'any.required': 'Patient ID is required',
    }),
    reason: Joi.string().required().messages({
        'string.empty': 'Reason is required',
        'any.required': 'Reason is required',
    }),
    status: Joi.string().required().messages({
        'string.empty': 'Status is required',
        'any.required': 'Status is required',
    }),
  
})

const updateAppointmentValidator = Joi.object({
    appointment_time: Joi.string().required().messages({
        'string.empty': 'Date is required',
        'any.required': 'Date is required',
    }),
    appointment_date: Joi.string().required().messages({
        'string.empty': 'Date is required',
        'any.required': 'Date is required',
    }),
    doctor_id: Joi.number().required().messages({
        'number.empty': 'Doctor ID is required',
        'any.required': 'Doctor ID is required',
    }),
    patient_id: Joi.number().required().messages({
        'number.empty': 'Patient ID is required',
        'any.required': 'Patient ID is required',
    }),
    reason: Joi.string().required().messages({
        'string.empty': 'Reason is required',
        'any.required': 'Reason is required',
    }),
    status: Joi.string().required().messages({
        'string.empty': 'Status is required',
        'any.required': 'Status is required',
    }),
  
})

module.exports = {
    appointmentValidator,
    
}