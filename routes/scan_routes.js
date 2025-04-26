
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    SessionValidator
} = require('../middlewares')
const {
    ScansControllers: {
        scanProductTag
    }
} = require('../controllers');
const {
    ScanValidator: {
        scanValidator
    },
    HeaderValidator,
} = require('../validators');

const tags = ["api", "Scans"];

module.exports = [
    {
        method: 'POST',
        path: '/user/scan',
        options: {
            description: 'Scan product tag',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: scanValidator,
                headers: HeaderValidator,
            },
            payload: {
                maxBytes: 20 * 1024 * 1024,
                parse: true,
                output: 'file',
                multipart: true,
                allow: 'multipart/form-data'
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            }
        },
        handler: scanProductTag,
    },
];