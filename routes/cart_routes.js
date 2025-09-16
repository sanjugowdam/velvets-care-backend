
const {
    SessionValidator,
    
} = require('../middlewares')
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
        CartController: {
     AddToCart,
    RemoveFromCart,
    IncrementCartItem,
    DecrementCartItem,
    GetCart,
    AdminCartStats
    }
} = require('../controllers');
const {
    CartValidator: {
    add_to_cart,
    remove_from_cart,
    update_cart_quantity,
    admin_cart_stats,
    }
} = require('../validators');
const {
    HeaderValidator,
} = require('../validators');
const tags = ["api", "Carts"];

module.exports = [
    {
        method: 'POST',
        path: '/cart/add',
        options: {
            description: 'Add to cart',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: add_to_cart,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }   
            },
        },
        handler: AddToCart
    },
    {
        method: 'POST',
        path: '/cart/remove',
        options: {
            description: 'Remove from cart',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: remove_from_cart,
                headers: HeaderValidator,
                failAction: (request, h, err) => {    
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: RemoveFromCart
    },
    {
        method: 'POST',
        path: '/cart/increment',
        options: {
            description: 'Increment cart item',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: update_cart_quantity,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: IncrementCartItem    
    },
    {
        method: 'POST',
        path: '/cart/decrement',
        options: {
            description: 'Decrement cart item',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: update_cart_quantity,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: DecrementCartItem    
    },
    {
        method: 'GET',
        path: '/cart',
        options: {
            description: 'Get cart',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: GetCart    
            },
    {
        method: 'GET',
        path: '/cart/stats',
        options: {
            description: 'Get cart statistics (admin)',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: AdminCartStats
    }
]