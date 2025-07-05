
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    AppointmentController: {
        getRtcToken
    }
} = require('../controllers');
const {
    AppointmentValidator: {
        appointment,
    },
    HeaderValidator,
} = require('../validators');
const {
    SessionValidator
} = require('../middlewares');
const Joi = require('joi');
const tags = ["api", "Video, Voice, Chat"];

module.exports = [
    {
        method: 'GET',
        path: '/appointments/{id}/communication-token',
        options: {
            description: 'Get RTC Token for doctor/patient',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                params: appointment,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: getRtcToken
    }
];