const Joi = require('joi');
const HeaderValidator = Joi.object({
    authorization: Joi.string().required().messages({
        'string.empty': 'Authorization is required',
        'any.required': 'Authorization is required',
    }),
}).unknown()

module.exports = {
    HeaderValidator,
    UserValidators: require('./users_validators'),
    ShopValidators: require('./shop_validators')
}