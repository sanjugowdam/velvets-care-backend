const {
    SessionValidator
} = require('../middlewares')
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    ClinicController: {
        createClinic

    }
} = require('../controllers');
const {
    ClinicValidator: {
        clinicValidator
    },
    HeaderValidator,
} = require('../validators');


const tags = ["api", "Clinic"];

module.exports = [
    {
        method: 'POST',
        path: '/clinic',
        options: {
            description: 'Create a clinic',
            tags,
            validate: {
                payload: clinicValidator
            }
        },
        handler: createClinic
    }
]