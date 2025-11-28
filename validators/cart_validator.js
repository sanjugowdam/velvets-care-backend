const Joi = require('joi');

// Add product to cart
const add_to_cart = Joi.object({
    product_id: Joi.number().required().messages({
        'any.required': 'Product ID is required',
        'number.base': 'Product ID must be a number'
    }),
    quantity: Joi.number().allow(null).default(1).messages({
        'number.base': 'Quantity must be a number'
    }),
});

// Remove product from cart
const remove_from_cart = Joi.object({
    id: Joi.number().required().messages({
        'any.required': 'Cart item ID is required',
        'number.base': 'Cart item ID must be a number'
    }),
});

// Increment / Decrement Cart item
const update_cart_quantity = Joi.object({
    id: Joi.number().required().messages({
        'any.required': 'Cart item ID is required',
        'number.base': 'Cart item ID must be a number'
    }),
});

// Admin fetch cart stats
const admin_cart_stats = Joi.object({
    // Optionally you can add pagination/search filters if needed
}).unknown();

module.exports = {
    add_to_cart,
    remove_from_cart,
    update_cart_quantity,
    admin_cart_stats
};
