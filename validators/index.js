const Joi = require('joi');
const scanValidator = require('./scan_validator');
const HeaderValidator = Joi.object({
    authorization: Joi.string().required().messages({
        'string.empty': 'Authorization is required',
        'any.required': 'Authorization is required',
    }),
}).unknown()

module.exports = {
    HeaderValidator,
    UserValidators: require('./users_validators'),
    ShopValidators: require('./shop_validators'),
    ScanValidator: require('./scan_validator'),
    AdminValidator: require('./admin_validator'),
    BannerValidator: require('./banner_validator'),

}