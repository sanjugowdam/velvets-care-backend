
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    AppointmentController: {
     precheckAndCreateOrder,
    confirmAppointment,
    cancelAppointmentByUser,
    getadminAppointments,
    getDoctorAppointments,
    doctoreject,
    DoctorApproval,
    getUserAppointments,
    checkDoctorAvailability
    }
} = require('../controllers');
const {
    AppointmentValidator: {
     appointmentValidator,
    razorpayPaymentValidator,
    cancelAppointmentValidator,
    fecthAppointmentsValidator,
    fetchdoctorAppointmentsValidator,
    appointment,
    },
    HeaderValidator,
} = require('../validators');
const {
    SessionValidator
} = require('../middlewares');
const Joi = require('joi');
const { createRazorpayOrder } = require('../helpers/razorpay');

const tags = ["api", "Appointment"];

module.exports = [
    {
        method: 'POST',
        path: '/appointment/payment',
        options: {
            description: 'payment for an appointment',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                payload: razorpayPaymentValidator,
                failAction: (request, h, err) => {
                                    const errors = err.details.map(e => e.message);
                                    throw Boom.badRequest(errors.join(', '));
                                }
            },
        },
        handler: precheckAndCreateOrder,
    },
    {
        method: 'POST',
        path: '/appointment/doctor-availability/check',
        options: {
            description: 'dr availability check',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                payload: razorpayPaymentValidator,
                failAction: (request, h, err) => {
                                    const errors = err.details.map(e => e.message);
                                    throw Boom.badRequest(errors.join(', '));
                                }
            },
        },
        handler: checkDoctorAvailability,
    },
    {
        method: 'POST',
        path: '/appointment/confirm',
        options: {
            description: 'Confirm an appointment',
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
        handler: confirmAppointment,
    },
    {
        method: 'POST',
        path: '/appointment/{id}/cancel',
        options: {
            description: 'Cancel an appointment by user',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                params: appointment,
                payload: cancelAppointmentValidator,
                failAction: (request, h, err) => {
                                    const errors = err.details.map(e => e.message);
                                    throw Boom.badRequest(errors.join(', '));
                                }
            },
        },
        handler: cancelAppointmentByUser,
    },
    {
        method: 'GET',
        path: '/admin/appointments',
        options: {
            description: 'Get all appointments',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                query: fecthAppointmentsValidator,
                failAction: (request, h, err) => {
                                    const errors = err.details.map(e => e.message);
                                    throw Boom.badRequest(errors.join(', '));
                                }
            },
        },
        handler: getadminAppointments,
    },
    {
        method: 'GET',
        path: '/doctor/appointments',
        options: {
            description: 'Get all appointments',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                headers: HeaderValidator,
                query: fetchdoctorAppointmentsValidator,
                failAction: (request, h, err) => {
                                    const errors = err.details.map(e => e.message);
                                    throw Boom.badRequest(errors.join(', '));
                                }
            },
        },
        handler: getDoctorAppointments,
    },
    {
        method: 'POST',
        path: '/appointment/{id}/reject',
        options: {
            description: 'Reject an appointment',
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
            },
        },
        handler: doctoreject,
    },
    {
        method: 'POST',
        path: '/appointment/{id}/approve',
        options: {
            description: 'Approve an appointment',
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
            },
        },
        handler: DoctorApproval,
    },

    {
        method: 'GET',
        path: '/razorpay',
        options: {
            description: 'Get all appointments',
            tags,
            validate: {
                query: Joi.object({
                    amount: Joi.number().required()
                }),
                failAction: (request, h, err) => {
                                    const errors = err.details.map(e => e.message);
                                    throw Boom.badRequest(errors.join(', '));
                                }
            },
        },
        handler: async (request, h) => {
            const amount = request.query.amount;
            const order = await createRazorpayOrder(amount);
            return h.response(order).code(200);
        }
    },
    {
        method: 'GET',
        path: '/user/appointments',
        options: {
            description: 'Get all appointments',
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
        handler: getUserAppointments,

    }
]