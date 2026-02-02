const Boom = require('@hapi/boom');
const Joi = require('joi');

const {
    FCMController: {
        saveFcmToken,
        testNotification
    }
} = require('../controllers');

const {
    HeaderValidator
} = require('../validators');

const { SessionValidator } = require('../middlewares');

const tags = ['api', 'FCM Tokens'];
module.exports = [
    {
  method: 'PUT',
  path: '/fcm/save-token',
  options: {
    description: 'Save FCM token',
    tags,
    pre: [SessionValidator],
    validate: {
      headers: HeaderValidator,
      payload: Joi.object({
        fcm_token: Joi.string().required()
      }),
      failAction: (request, h, err) => {
        const errors = err.details.map(e => e.message);
        throw Boom.badRequest(errors.join(', '));
      }
    }
  },
  handler: saveFcmToken,
},
  {
        method: 'POST',
        path: '/fcm/test',
        options: {
            description: 'Test FCM push notification',
            tags,
            pre: [SessionValidator],
            validate: {
                headers: HeaderValidator,
                payload: Joi.object({
                    fcm_token: Joi.string().required(),
                    title: Joi.string().optional(),
                    body: Joi.string().optional()
                }),
                failAction: (request, h, err) => {
                    throw Boom.badRequest(err.details.map(e => e.message).join(', '));
                }
            }
        },
        handler: testNotification
    }
]


