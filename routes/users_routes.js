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
        logout
    }
} = require('../controllers');
const {
    UserValidators: {
        login_user,
        verify_otp_validator,
        logout_user
    },
    HeaderValidator,
} = require('../validators');

const tags = ["api", "Users"];
module.exports = [

    {
        method: 'POST',
        path: '/users/login-register',
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
        path: '/users/verify-otp',
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
        path: '/session-check-user',
        options: {
            description: 'Check user session',
            tags,
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
        path: '/users/logout',
        options: {
            description: 'Logout user',
            tags,
            validate: {
                payload: logout_user,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: logout,
    }


];
