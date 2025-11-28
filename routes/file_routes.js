const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    FileController: {
        uploadFileFunc,
        getFile
    }
} = require('../controllers');
const Joi = require('joi');


const tags = ["api", "File"];

module.exports = [
    {
        method: 'POST',
        path: '/file/upload-test',
        options: {
            description: 'Upload file',
            tags,
            validate: {
                payload: Joi.object({
                    image: Joi.any()
                        .meta({ swaggerType: 'file' })
                        .description('Image file of the banner')
                        .required().messages({
                            'any.required': 'Image is required',
                            'string.empty': 'Image is required',
                        }),
                }),
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
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
        handler: uploadFileFunc,
    },
    {
        method: 'POST',
        path: '/file-test',
        options: {
            description: 'Get file',
            tags,
            validate: {
                payload: Joi.object({
                    path: Joi.string().required()
                }),
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: getFile,
    }
]
