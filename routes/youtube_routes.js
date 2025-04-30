
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    YoutubeController: {
        youtube
    }
} = require('../controllers');

const tags = ["api", "Youtube"];

module.exports = [
    {
        method: 'GET',
        path: '/youtube/videos',
        options: {
            description: 'Get videos',
            tags,
        },
        handler: youtube,
    }
]