const { AuthUserSchema, refreshTokenSchema} = require('./validator/AuthPayloadSchema');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/authentications',
    options: {
      validate: {
        payload: AuthUserSchema,
        failAction: (request, h, err) => {
          throw err;
        }
      }
    },
    handler: handler.postAuthhandler,
  },
  {
    method: 'PUT',
    path: '/authentications',
    options: {
      validate: {
        payload: refreshTokenSchema,
        failAction: (request, h, err) => {
          throw err;
        }
      }
    },
    handler: handler.putAuthhandler,
  },
  {
    method: 'DELETE',
    path: '/authentications',
    options: {
      validate: {
        payload: refreshTokenSchema,
        failAction: (request, h, err) => {
          throw err;
        }
      }
    },
    handler: handler.deleteAuthhandler,
  },
]);

module.exports = routes;
