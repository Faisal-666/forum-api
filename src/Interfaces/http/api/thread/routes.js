const threadPostSchema = require('./validator/ThreadPayloadSchema');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    options: {
      auth: 'jwt_auth',
      validate: {
        payload: threadPostSchema,
        failAction: (request, h, err) => {
          throw err;
        }
      }
    },
    handler: handler.postThreadhandler,
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getDetailThreadhandler,
  },
]);

module.exports = routes;
