
const {
    SessionValidator,
    
} = require('../middlewares')
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    DiscountController: {
     CreateDiscount,
    UpdateDiscount,
    DeleteDiscount,
    GetDiscountById,
    AdminDiscounts,
    AssignDiscountToProduct,
    AssignDiscountToUser,
    ValidateDiscountUsage
    }
} = require('../controllers');
const {
    DiscountValidator: {
    create_discount_validator,
    update_discount_validator,
    assign_discount_to_product_validator,
    assign_discount_to_user_validator,
    validate_discount_usage_validator,
    fetch_single_discount_validator

    }
} = require('../validators');
const {
    HeaderValidator,
} = require('../validators');
const tags = ["api", "Discounts"];

module.exports = [
    {
        method: 'POST',
        path: '/discount/create',
        options: {
            description: 'Create a new discount',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: create_discount_validator,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: CreateDiscount 
    },
    {
        method: 'GET',
        path: '/discount/admin',
        options: {
            description: 'Get all discounts',
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
        handler: AdminDiscounts 
    },
    {
        method: 'GET',
        path: '/discount/{id}',
        options: {
            description: 'Get a discount by ID',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                params: fetch_single_discount_validator,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: GetDiscountById                    
    },
    {
        method: 'POST',
        path: '/discount/update',
        options: {
            description: 'Update a discount',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: update_discount_validator,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: UpdateDiscount                    
    },
    {
        method: 'DELETE',
        path: '/discount/{id}',
        options: {
            description: 'Delete a discount',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                params: fetch_single_discount_validator,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: DeleteDiscount                    
    },
    {
        method: 'POST',
        path: '/discount/assign/product',
        options: {
            description: 'Assign a discount to a product',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: assign_discount_to_product_validator,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: AssignDiscountToProduct                    
    },
    {
        method: 'POST',
        path: '/discount/assign/user',
        options: {
            description: 'Assign a discount to a user',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: assign_discount_to_user_validator,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: AssignDiscountToUser                    
    },
    {
        method: 'POST',
        path: '/discount/validate',
        options: {
            description: 'Validate a discount usage',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: validate_discount_usage_validator,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: ValidateDiscountUsage
    },
            ]