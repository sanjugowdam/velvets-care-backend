const Joi = require('joi');

// Dashboard — Start & End Date
const dashboard_date_range = Joi.object({
    start_date: Joi.string().required().messages({
        'any.required': 'Start date is required'
    }),
    end_date: Joi.string().required().messages({
        'any.required': 'End date is required'
    })
}).unknown();

// Yearly Dashboard
const dashboard_yearly = Joi.object({
    year: Joi.number().required().messages({
        'any.required': 'Year is required',
        'number.base': 'Year must be a number'
    })
}).unknown();

module.exports = {
    dashboard_date_range,
    dashboard_yearly
};
