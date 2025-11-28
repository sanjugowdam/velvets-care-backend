
const {
    SessionValidator,
    
} = require('../middlewares')
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    DiscountedUserController: {
    CreateDiscountedUser,
    UpdateDiscountedUser,
    DeleteDiscountedUser,
    GetDiscountedUsers

    }
} = require('../controllers');
const {
    DiscountedUserValidator: {
    create_discounted_user_validator,
    update_discounted_user_validator,
    get_discounted_users_validator,
    }
} = require('../validators');
const {
    HeaderValidator,
} = require('../validators');
const { FileSystemCredentials } = require('aws-sdk');
const tags = ["api", "Discounted Users"];

module.exports = [
    {
        method: 'POST', 
        path: '/discounteduser',
        options: {
            description: 'Create a discounted user',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: create_discounted_user_validator,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: CreateDiscountedUser,
    },
    {
        method: 'GET',
        path: '/discountedusers',
        options: {
            description: 'Get all discounted users',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                query: get_discounted_users_validator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: GetDiscountedUsers,
    },    
    {
        method: 'PUT',
        path: '/discounteduser/{id}',
        options: {
            description: 'Update a discounted user',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: update_discounted_user_validator,
                params: update_discounted_user_validator,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: UpdateDiscountedUser,
    },
    {
        method: 'DELETE',
        path: '/discounteduser/{id}',
        options: {
            description: 'Delete a discounted user',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                params: update_discounted_user_validator,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: DeleteDiscountedUser,
    },
            ]