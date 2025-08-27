
const {
    SessionValidator,
    
} = require('../middlewares')
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    ProductController: {
          CreateProduct,
    GetProductById,
    uploadProductImage,
    }
} = require('../controllers');
const {
    ProductValidator: {
        createProductValidator,
        createimageValidator
    },
    HeaderValidator,
} = require('../validators');



const tags = ["api", "Products"];
module.exports = [
    {
        method: 'POST',
        path: '/products',
        options: {
            description: 'Create a new product',
        tags,
        pre: [
            SessionValidator
        ],
        
            validate: {
                payload: createProductValidator,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: CreateProduct
    },
    {
        method: 'POST',
        path: '/products/{id}/images',
        options: {
          description: 'Create a new product image',
        tags,
        pre: [
            SessionValidator
        ],
            validate: {
                payload: createimageValidator,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
             payload: {
                maxBytes: 20 * 1024 * 1024,
                parse: true,
                output: 'file',
                multipart: true,
                allow: 'multipart/form-data'
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            }
        },
        handler: uploadProductImage
    }
];  