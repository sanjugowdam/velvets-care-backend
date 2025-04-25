const Joi = require('joi');

const getshop = Joi.object({
  lat: Joi.string().required().messages({
    'string.empty': 'Latitude is required',
    'any.required': 'Latitude is required',
  }),
  long: Joi.string().required().messages({
    'string.empty': 'Longitude is required',
    'any.required': 'Longitude is required',
  }),
  type: Joi.string().required().messages({
    'string.empty': 'Shop type is required',
    'any.required': 'Shop type is required',
  }),
  radius: Joi.string().required().messages({
    'string.empty': 'Search radius is required',
    'any.required': 'Search radius is required',
  }),
});

const searchShopsValidator = Joi.object({
    keyword: Joi.string().required().messages({
      'string.empty': 'Search keyword is required',
      'any.required': 'Search keyword is required',
    }),
    radius: Joi.string().required().messages({
      'string.empty': 'Search radius is required',
      'any.required': 'Search radius is required',
    }),
    lat: Joi.string().required().messages({
      'string.empty': 'Latitude is required',
      'any.required': 'Latitude is required',
    }),
    long: Joi.string().required().messages({
      'string.empty': 'Longitude is required',
      'any.required': 'Longitude is required',
    }),
});

module.exports = {
  getshop,
  searchShopsValidator
};