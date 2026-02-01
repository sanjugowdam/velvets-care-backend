const Boom = require('@hapi/boom');
const Joi = require('joi');

const {
    PrescriptionController: {
        uploadPrescription,
        getUserPrescriptions,
        getDoctorPrescriptions,
        getAdminPrescriptions,
        getPrescriptionById,
        updatePrescription,
        deletePrescription
    }
} = require('../controllers');

const {
    PrescriptionValidator: {
        DoctorUploadPrescriptionToUserValidator,
        DoctorUploadPrescriptionSelfValidator,
        AdminUploadPrescriptionForUserValidator,
        UserUploadPrescriptionValidator,
        UserFetchPrescriptionsValidator,
        DoctorFetchPrescriptionsValidator,
        AdminFetchPrescriptionsValidator,
        DeletePrescriptionValidator,
        UpdatePrescriptionValidator
    },
    HeaderValidator
} = require('../validators');

const { SessionValidator } = require('../middlewares');

const tags = ['api', 'Prescription'];

module.exports = [

    /* -------------------- DOCTOR ROUTES -------------------- */

    {
        method: 'POST',
        path: '/doctor/prescription/upload/user',
        options: {
            description: 'Doctor uploads prescription for a user',
            tags,
            pre: [SessionValidator],
            validate: {
                headers: HeaderValidator,
                payload: DoctorUploadPrescriptionToUserValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: uploadPrescription
    },

    {
        method: 'POST',
        path: '/doctor/prescription/upload/self',
        options: {
            description: 'Doctor uploads prescription for self reference',
            tags,
            pre: [SessionValidator],
            validate: {
                headers: HeaderValidator,
                payload: DoctorUploadPrescriptionSelfValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: uploadPrescription
    },

    {
        method: 'GET',
        path: '/doctor/prescriptions',
        options: {
            description: 'Doctor fetch prescriptions with stats',
            tags,
            pre: [SessionValidator],
            validate: {
                headers: HeaderValidator,
                query: DoctorFetchPrescriptionsValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: getDoctorPrescriptions
    },

    /* -------------------- USER ROUTES -------------------- */

    {
        method: 'POST',
        path: '/user/prescription/upload',
        options: {
            description: 'User uploads prescription for self',
            tags,
            pre: [SessionValidator],
            validate: {
                headers: HeaderValidator,
                payload: UserUploadPrescriptionValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: uploadPrescription
    },

    {
        method: 'GET',
        path: '/user/prescriptions',
        options: {
            description: 'User fetch own & doctor given prescriptions',
            tags,
            pre: [SessionValidator],
            validate: {
                headers: HeaderValidator,
                query: UserFetchPrescriptionsValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: getUserPrescriptions
    },

    /* -------------------- ADMIN ROUTES -------------------- */

    {
        method: 'POST',
        path: '/admin/prescription/upload',
        options: {
            description: 'Admin uploads prescription for user',
            tags,
            pre: [SessionValidator],
            validate: {
                headers: HeaderValidator,
                payload: AdminUploadPrescriptionForUserValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: uploadPrescription
    },

    {
        method: 'GET',
        path: '/admin/prescriptions',
        options: {
            description: 'Admin fetch all prescriptions',
            tags,
            pre: [SessionValidator],
            validate: {
                headers: HeaderValidator,
                query: AdminFetchPrescriptionsValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: getAdminPrescriptions
    },

    /* -------------------- COMMON ROUTES -------------------- */

    {
        method: 'GET',
        path: '/prescription/{id}',
        options: {
            description: 'Fetch single prescription',
            tags,
            pre: [SessionValidator],
            validate: {
                headers: HeaderValidator,
                params: Joi.object({
                    id: Joi.number().integer().required()
                }),
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: getPrescriptionById
    },

    {
        method: 'PUT',
        path: '/prescription/update',
        options: {
            description: 'Update prescription',
            tags,
            pre: [SessionValidator],
            validate: {
                headers: HeaderValidator,
                payload: UpdatePrescriptionValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: updatePrescription
    },

    {
        method: 'DELETE',
        path: '/prescription/delete',
        options: {
            description: 'Delete prescription',
            tags,
            pre: [SessionValidator],
            validate: {
                headers: HeaderValidator,
                payload: DeletePrescriptionValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: deletePrescription
    }

];
