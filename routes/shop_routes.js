
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    ShopsControllers: {
        getFashionShops,
        searchShops
    }
} = require('../controllers');
const {
    ShopValidators: {
        getshop,    
        searchShopsValidator
    },
    HeaderValidator,
} = require('../validators');

const tags = ["api", "Shops"];

module.exports = [
    {
        method: 'GET',
        path: '/shops',
        options: {
            description: 'Get all fashion shops',
            tags,
            validate: {
                query: getshop,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: getFashionShops,
    },
    {
        method: 'GET',
        path: '/shops/search',
        options: {
            description: 'Search fashion shops',
            tags,
            validate: {
                query: searchShopsValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }    
        },
        handler: searchShops,           
        }
    ];