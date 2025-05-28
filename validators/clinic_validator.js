const Joi = require('joi');

const clinicValidator = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required',
    }),
    address: Joi.string().required().messages({
        'string.empty': 'Address is required',
        'any.required': 'Address is required',
    }),
    street: Joi.string().required().messages({
        'string.empty': 'Address is required',
        'any.required': 'Address is required',
    }),
    floor_number: Joi.string().required().messages({
        'string.empty': 'Floor number is required',
        'any.required': 'Floor number is required',
    }),
    area: Joi.string().required().messages({
        'string.empty': 'Area is required',
        'any.required': 'Area is required',
    }),
    city: Joi.string().required().messages({
        'string.empty': 'City is required',
        'any.required': 'City is required',
    }),
    state: Joi.string().required().messages({
        'string.empty': 'State is required',
        'any.required': 'State is required',
    }),
    country: Joi.string().required().messages({
        'string.empty': 'Country is required',
        'any.required': 'Country is required',
    }),
    pincode: Joi.string().required().messages({
        'string.empty': 'Zip code is required',
        'any.required': 'Zip code is required',
    }),
    landmark: Joi.string().required().messages({
        'string.empty': 'Landmark is required',
        'any.required': 'Landmark is required',
    }),
    phone: Joi.string().required().messages({
        'string.empty': 'Phone number is required',
        'any.required': 'Phone number is required',
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
    }),
    profile_image: Joi.any()
      .meta({ swaggerType: 'file' })
      .description('clinic profile image').messages({
        'any.required': 'Image is required',
        'string.empty': 'Image is required',
      }),
      description: Joi.string().required().messages({
        'string.empty': 'Description is required',
        'any.required': 'Description is required',
      }),
});

module.exports ={
    clinicValidator,
    
}