const {
    SessionValidator
} = require('../middlewares')
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    UsersControllers: {
        list_users,
        register_and_login_by_otp,
        register_and_login_verify_otp
    }
} = require('../controllers');
const {
    UserValidators: {
        list_users_query,
        register_login_user_and_send_otp_payload,
        register_login_user_otp_verification_payload
    },
    HeaderValidator,
} = require('../validators');
const tags = ["api", "Users"];
module.exports = [
    {
        method: 'GET',
        path: '/users',
        options: {
            description: 'List of users',
            tags,
            // pre: [
            //     SessionValidator
            // ],
            validate: {
                // headers: HeaderValidator,
                query: list_users_query,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
            handler: list_users,
        },
    },
    {
        method: 'POST',
        path: '/users/login-register',
        options: {
            description: 'Login and register user',
            tags,
            validate: {
                payload: register_login_user_and_send_otp_payload,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
            handler: register_and_login_by_otp,
        },
    },
    {
        method: 'POST',
        path: '/users/verify-otp',
        options: {
            description: 'Verify login and register otp',
            tags,
            validate: {
                payload: register_login_user_otp_verification_payload,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
            handler: register_and_login_verify_otp,
        },
    }
];
