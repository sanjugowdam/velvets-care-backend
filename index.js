'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Package = require('./package.json');
const seq = require("./config/sequelize");
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
            title: 'Green Sense AI API Documentation',
            version: Package.version,
            description: 'API Documentation for Green Sense AI',
            contact: {
                name: 'Debanjan & Sanjay',
            }
        },
        basePath: '/green-sense-ai',
        documentationPath: '/green-sense-ai/documentation',
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
        name: 'Green Sense AI Routes',
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
    console.log('Green Sense AI Server running on \x1b[34m%s\x1b[0m', server.info.uri);
    console.log('Swagger documentation is available at: \x1b[34m%s/documentation\x1b[0m', server.info.uri);
};

// Error handling
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
