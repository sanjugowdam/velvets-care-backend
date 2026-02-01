const Boom = require('@hapi/boom');
const Joi = require('joi');

const {
    FCMController: {
        saveFcmToken
    }
} = require('../controllers');

const {
    HeaderValidator
} = require('../validators');

const { SessionValidator } = require('../middlewares');

const tags = ['api', 'FCM Tokens'];
module.exports = [
    {
  method: 'POST',
  path: '/fcm/save-token',
  options: {
    description: 'Save FCM token',
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
}
]


