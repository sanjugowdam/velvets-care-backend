const {
    SessionValidator
} = require('../middlewares')
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    AdminController: {
        send_otp_admin,
        verify_otp_admin
    }
} = require('../controllers');
const {
    AdminValidator: {
        login_admin,
    verify_otp_admin_validotor,
    update_admin_profile
    },
    HeaderValidator,
} = require('../validators');



const tags = ["api", "Admin"];

module.exports = [
    {
        method: 'POST',
        path: '/admin/send-otp',
        options: {
            description: 'Send otp to admin',
            tags,
            validate: {
                payload : login_admin ,
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
    }
];