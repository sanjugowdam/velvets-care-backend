const Joi = require('joi');

// Add product to wishlist
const add_to_wishlist = Joi.object({
    product_id: Joi.number().required().messages({
        'any.required': 'Product ID is required',
        'number.base': 'Product ID must be a number'
    }),
});

// Remove product from wishlist
const remove_from_wishlist = Joi.object({
    id: Joi.number().required().messages({
        'any.required': 'Wishlist item ID is required',
        'number.base': 'Wishlist item ID must be a number'
    }),
});

// Admin fetch wishlist stats
const admin_wishlist_stats = Joi.object({
    // Optionally you can add pagination/search filters if needed
}).unknown();

module.exports = {
    add_to_wishlist,
    remove_from_wishlist,
    admin_wishlist_stats
};
