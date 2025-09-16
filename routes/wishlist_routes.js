
const {
    SessionValidator,
    
} = require('../middlewares')
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    WishlistController: {
         AddToWishlist,
    RemoveFromWishlist,
    GetWishlist,
    AdminWishlistStats
    }
} = require('../controllers');
const {
    WishlistValidator: {
        add_to_wishlist,
    remove_from_wishlist,
    admin_wishlist_stats
    }
} = require('../validators');

const {
    HeaderValidator,
} = require('../validators');
const tags = ["api", "Wishlists"];
module.exports = [
    {
        method: 'POST',
        path: '/wishlist/add',
        options: {
            description: 'Add to wishlist',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: add_to_wishlist,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }    
            },
        },
        handler: AddToWishlist
    },
    {
        method: 'POST',
        path: '/wishlist/remove',
        options: {
            description: 'Remove from wishlist',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: remove_from_wishlist,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }    
            },
        },
        handler: RemoveFromWishlist
    },
    {
        method: 'GET',
        path: '/wishlist',
        options: {
            description: 'Get wishlist',
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
        handler: GetWishlist
            }
    ,
    {
        method: 'GET',
        path: '/wishlist/stats',
        options: {
            description: 'Get wishlist stats (admin)',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                query: admin_wishlist_stats,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }    
            },
        },
        handler: AdminWishlistStats
    }
]