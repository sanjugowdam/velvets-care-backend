const {
    SessionValidator,

} = require('../middlewares')
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    AdminController: {
        send_otp_admin,
        verify_otp_admin,
        fetchAdmins,
        createAdmin
    }
} = require('../controllers');
const {
    AdminValidator: {
        login_admin,
        verify_otp_admin_validotor,
        update_admin_profile,
        Create_admin
    },
    HeaderValidator,
} = require('../validators');
const { validateSession } = require('../controllers/admin_controller');



const tags = ["api", "Admin"];

module.exports = [
    {
        method: 'POST',
        path: '/admin/send-otp',
        options: {
            description: 'Send otp to admin',
            tags,
            validate: {
                payload: login_admin,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: send_otp_admin,
    },

    {
        method: 'POST',
        path: '/admin/verify-otp',
        options: {
            description: 'Verify OTP',
            tags,
            validate: {
                payload: verify_otp_admin_validotor,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: verify_otp_admin,
    },

    {
        method: 'GET',
        path: '/admin/list',
        options: {
            description: 'Get list of admins',
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
            }
        },
        handler: fetchAdmins,
    },
    {
        method: 'GET',
        path: '/admin/verify-session',
        options: {
            description: 'Get list of admins',
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
            }
        },
        handler: validateSession,
    },
    {
        method: 'POST',
        path: '/admin/create',
        options: {
            description: 'Create admin',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: Create_admin,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: createAdmin,
    }
];