'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Package = require('./package.json');
const seq = require("./config/sequelize");
const Joi = require('joi');
const Boom = require('@hapi/boom');
const path = require('path');
const fs = require('fs');

const {
    env: {
        HOST,
        PORT
    }
} = require('./config')

const routes = require('./routes');

const init = async () => {

    const server = Hapi.server({
        port: PORT,
        host: HOST,
        routes: {
            cors: {
                origin: ['*'],
            }
        }
    });

    // Swagger options
    const swaggerOptions = {
        info: {
            title: 'Velvets Care API Documentation',
            version: Package.version,
            description: 'API Documentation for Velvets Care',
            contact: {
                name: 'Debanjan & Sanjay',
            }
        },
        grouping: 'tags',
        sortEndpoints: 'ordered',
        schemes: ['http', 'https'],  // 'https' for production
    };

    // Register plugins
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    // Register routes
    const routesPlugin = {
        name: 'Velvets Care Routes',
        version: '1.0.0',

        register: (server, options) => {
            server.route(routes);
        }
    };

    // Register plugin with prefix
    await server.register({
        plugin: routesPlugin,
        options: {},
        routes: {
            prefix: '/api/v1'
        },
    });
    // sending local files to client to preview
    server.route({
        method: 'GET',
        path: '/{path*}',
        options: {
            tags: ['api', 'file'],  // Swagger tag
            description: 'Preview a file in the browser',
            notes: 'This API returns the file directly for preview in the browser.',
            validate: {
                params: Joi.object({
                    path: Joi.string().required().description('Path to the file to stream').messages({
                        'any.required': 'File path is required'
                    })
                }),
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            },
        },
        handler: (request, h) => {
            const filePath = request.params.path;
            const fullPath = path.join(__dirname, filePath);

            if (fs.existsSync(fullPath)) {
                return h.file(fullPath);
            } else {
                console.error('File not found:', fullPath);
                return h.response('File not found').code(404);
            }
        }
    });


    (async (sequelize) => {
        try {
            await sequelize.authenticate();
            console.log("MySQL Connected Successfully.");
        } catch (error) {
            console.error("Unable to connect to the MySQL:", error);
        }
    })(seq);
    
    // Start the server
    await server.start();
    console.clear()
    console.log('Velvets Care API running on \x1b[34m%s\x1b[0m', server.info.uri);
    console.log('Swagger documentation is available at: \x1b[34m%s/documentation\x1b[0m', server.info.uri);
};

// Error handling
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
