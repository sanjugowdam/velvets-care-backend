
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
    }
} = require('../controllers');
const {
    AppointmentValidator: {
     appointmentValidator,
    razorpayPaymentValidator,
    updateAppointmentValidator,
    cancelAppointmentValidator,
    ApproveAppointmentValidator,
    fecthAppointmentsValidator,
    fetchdoctorAppointmentsValidator,
    appointment,
    },
    HeaderValidator,
} = require('../validators');
const {
    SessionValidator, SessionValidatorAdmin
} = require('../middlewares')

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
                payload: ApproveAppointmentValidator,
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
                payload: ApproveAppointmentValidator,
                failAction: (request, h, err) => {
                                    const errors = err.details.map(e => e.message);
                                    throw Boom.badRequest(errors.join(', '));
                                }
            },
        },
        handler: DoctorApproval,
    },
]