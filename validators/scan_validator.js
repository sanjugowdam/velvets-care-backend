const Joi = require('joi');

const Joi = require('joi');

const scanValidator = Joi.object({
  lat: Joi.number().required().messages({
    'number.base': 'Latitude must be a number',
    'any.required': 'Latitude is required',
  }),
  long: Joi.number().required().messages({
    'number.base': 'Longitude must be a number',
    'any.required': 'Longitude is required',
  }),
  image: Joi.object().required().messages({
    'any.required': 'Image is required',
  }),
 
});

module.exports = scanValidator;
