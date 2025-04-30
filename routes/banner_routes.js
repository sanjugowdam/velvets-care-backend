const {
    SessionValidator
} = require('../middlewares')
const Boom = require('@hapi/boom');
// src/routes/authRoutes.js
const {
    BannerController: {
        banner_upload,
        get_banner_users,
        banner_delete,
        get_banner_admin
    }
} = require('../controllers');
const {
    BannerValidator: {
        bannerValidator,
        deleteBannerValidator,
        allBanners
    },
    HeaderValidator,
} = require('../validators');



const tags = ["api", "Banner"];

module.exports = [
    {
        method: 'POST',
        path: '/banner/upload',
        options: {
            description: 'Upload banner',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: bannerValidator,
                headers: HeaderValidator,
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
        handler: banner_upload,
    },
    {
        method: 'GET',
        path: '/users/banners',
        options: {
            description: 'Get banner',
            tags,
        },
        handler: get_banner_users,
    },
    {
        method: 'DELETE',
        path: '/banner/delete',
        options: {
            description: 'Delete banner',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                payload: deleteBannerValidator,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: banner_delete,
    },
    {
        method: 'GET',
        path: '/admin/banners',
        options: {
            description: 'Get banner',
            tags,
            pre: [
                SessionValidator
            ],
            validate: {
                query: allBanners,
                headers: HeaderValidator,
                failAction: (request, h, err) => {
                    const errors = err.details.map(e => e.message);
                    throw Boom.badRequest(errors.join(', '));
                }
            }
        },
        handler: get_banner_admin,
    },
]
