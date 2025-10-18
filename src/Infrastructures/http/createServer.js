const Jwt = require('@hapi/jwt');
const Hapi = require('@hapi/hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const users = require('../../Interfaces/http/api/users');
const auth = require('../../Interfaces/http/api/auth');
const threads = require('../../Interfaces/http/api/thread');
const comments = require('../../Interfaces/http/api/comment');
const replies = require('../../Interfaces/http/api/reply');
const ClientError = require('../../Commons/execptions/ClientError');
const config = require('../../Commons/config');
const DomainErrorTranslator = require('../../Commons/execptions/DomainErrorTranslator');

const createServer = async (container) => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    debug: config.app.debug,
  });


  const swaggerOptions = {
    info: {
      title: 'Auth API Documentation',
      version: '1.0.0',
    },
  };

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
    {
      plugin: Vision,
    },
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  server.auth.strategy('jwt_auth', 'jwt', {
    keys: config.token.acc_key,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.token.age,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });
  
  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: auth,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
    {
      plugin: comments,
      options: { container },
    },
    {
      plugin: replies,
      options: { container },
    },
  ]);

  server.ext('onPreResponse', (req, h) => {
    const { response } = req;

    if (response instanceof Error) {
    //joi
      if (response.isJoi) {
        const newRes = h.response({
          status: 'fail',
          message: response.message,
        });
        newRes.code(400);
        return newRes;
      }

      //domain layer
      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        const newRes = h.response({
          status: 'fail',
          message: translatedError.message,
        });
        newRes.code(translatedError.statusCode);
        return newRes;
      }

      if (!translatedError.isServer) { //behavior 404
        return h.continue;
      } 

      //server
      const newRes = h.response({
        status: 'fail',
        message: 'terjadi kegagalan pada server kami',
      });
      newRes.code(500);
      return newRes;
    }

    return h.continue;
  });

  return server;
};

module.exports = createServer;
