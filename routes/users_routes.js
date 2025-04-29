const {
    SessionValidator
} = require('../middlewares')
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    UsersControllers: {
        request_otp,
        verify_otp,
        validateusersession,
        logout,
        update_user,
        user_refresh_token,
        getusers
    }
} = require('../controllers');
const {
    UserValidators: {
        login_user,
        verify_otp_validator,
        logout_user,
        update_user_profile,
        user_refresh_token_validator,
        get_user_list
    },
    HeaderValidator,
} = require('../validators');


const tags = ["api", "Users"];
module.exports = [

    {
        method: 'POST',
        path: '/user/login-register',
        options: {
            description: 'Login and register user',
            tags,
            validate: {
                payload: login_user,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
            handler: request_otp,
        },
    },
    {
        method: 'POST',
        path: '/user/verify-otp',
        options: {
            description: 'Verify OTP',
            tags,
            validate: {
                payload: verify_otp_validator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
            handler: verify_otp,
        }
    },

    {
        method: 'GET',
        path: '/user/validate-session',
        options: {
            description: 'Check user session',
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
        handler: validateusersession,
    },
    {
        method: 'POST',
        path: '/user/logout',
        options: {
            description: 'Logout user',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: logout_user,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: logout,
    },
    {
        method: 'PUT',
        path: '/user/update-profile',
        options: {
            description: 'Update user profile',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                payload: update_user_profile,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                },
            },
            payload: {
                maxBytes: 5 * 1024 * 1024,
                parse: true,
                output: 'file',
                multipart: true,
                allow: 'multipart/form-data'
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            handler: update_user,
        },
    },
    {
        method: 'POST',
        path: '/user/refresh-token',
        options: {
            description: 'Refresh user token',
            tags,
            validate: {
                headers: user_refresh_token_validator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: user_refresh_token,
    },
    {
        method: 'GET',
        path: '/users',
        options: {
            description: 'Get all users',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                query: get_user_list,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: getusers,
    }
];
