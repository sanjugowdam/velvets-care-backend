
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    AppointmentController: {
        createAppointment
    }
} = require('../controllers');
const {
    AppointmentValidator: {
    appointmentValidator
    },
    HeaderValidator,
} = require('../validators');
const {
    SessionValidator
} = require('../middlewares')

const tags = ["api", "Appointment"];

module.exports = [
    {
        method: 'POST',
        path: '/appointment',
        options: {
            description: 'Create an appointment',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                payload: appointmentValidator,
                failAction: (request, h, err) => {
                                    const errors = err.details.map(e => e.message);
                                    throw Boom.badRequest(errors.join(', '));
                                }
            },
        },
        handler: createAppointment,
    },
]