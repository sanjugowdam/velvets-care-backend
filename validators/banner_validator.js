const  Joi  = require('joi');

const bannerValidator = Joi.object({
    image: Joi.any()
    .meta({ swaggerType: 'file' })
    .description('Image file of the banner')
    .required().messages({
        'any.required': 'Image is required',
        'string.empty': 'Image is required',
    }),
    title: Joi.string().required().messages({
        'string.empty': 'Title is required',
        'any.required': 'Title is required',
    }),
})

const deleteBannerValidator = Joi.object({
    banner_id: Joi.number().required().messages({
        'string.empty': 'Banner id is required',
        'any.required': 'Banner id is required',
    }),
})

const allBanners = Joi.object({
    page: Joi.number().allow(null).messages({
        'string.empty': 'Page is required',
        'any.required': 'Page is required',
    }),
    limit: Joi.number().allow(null).messages({
        'string.empty': 'Limit is required',
        'any.required': 'Limit is required',
    }),
})




module.exports = {
    bannerValidator,
    deleteBannerValidator,
    allBanners
}