const {
    SessionValidator
} = require('../middlewares')
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    DoctorController: {
        updateBasicDetails,
        updateAddress,
        updateAvailability,
        updateStatus,
        doctorlist_user

    }
} = require('../controllers');
const {
    DoctorValidator: {
        basicDetailsValidator,
        statusValidator,
        availabilityValidator,
        addressValidator,
    },
    HeaderValidator,
} = require('../validators');


const tags = ["api", "Doctor"];

module.exports = [
    {
        method: 'POST',
        path: '/doctor/create',
        options: {
            description: 'Update basic details of doctor',
            tags,
            pre:[
                SessionValidator
            ],
            validate: {
                payload: basicDetailsValidator,
                headers: HeaderValidator,
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
            },
            handler: updateBasicDetails
        },
    
    {
        method: 'POST',
        path: '/doctor/update-address',
        options: {
            description: 'Update address of doctor',
            tags,
            pre:[
                SessionValidator
            ],
            validate: {
                payload: addressValidator,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                },
            },
            handler: updateAddress
        }
    },
    {
        method: 'POST',
        path: '/doctor/update-availability',
        options: {
            description: 'Update availability of doctor',
            tags,
            pre:[
                SessionValidator
            ],
            validate: {
                payload: availabilityValidator,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                },
            },
            handler: updateAvailability
        }
    },
    {
        method: 'POST',
        path: '/doctor/update-status',
        options: {
            description: 'Update status of doctor',
            tags,
            pre:[
                SessionValidator
            ],
            validate: {
                payload: statusValidator,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                },
                
            },
            handler: updateStatus
        }
    },
   {
    method: 'GET',
    path: '/doctor/list',
    options: {
        description: 'Get list of doctors',
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
        handler: doctorlist_user
    }
}

    

];