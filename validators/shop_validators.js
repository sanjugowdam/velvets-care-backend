const Joi = require('joi');

const getshop = Joi.object({
  lat: Joi.number().required().messages({
    'string.empty': 'Latitude is required',
    'any.required': 'Latitude is required',
  }),
  long: Joi.number().required().messages({
    'string.empty': 'Longitude is required',
    'any.required': 'Longitude is required',
  }),
  searchquery: Joi.string().allow(null).messages({
    'string.empty': 'Shop type is required',
  }),
  radius: Joi.number().required().messages({
    'string.empty': 'Search radius is required',
    'any.required': 'Search radius is required',
  }),
});

const Getlcoation_validator = Joi.object({
  lat: Joi.number().required().messages({
    'string.empty': 'Latitude is required',
    
    'any.required': 'Latitude is required',
  }),
  long: Joi.number().required().messages({
    'string.empty': 'Longitude is required',
    'any.required': 'Longitude is required',
  }),
})


module.exports = {
  getshop,
  Getlcoation_validator
  
};