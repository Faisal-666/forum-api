const registerUserSchema = require('./validator/registerUserSchema');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/users',
    options: {
      validate: {
        payload: registerUserSchema,
        failAction: (request, h, err) => {
          throw err;
        }
      }
    },
    handler: handler.postUserhandler,
  },
]);

module.exports = routes;
