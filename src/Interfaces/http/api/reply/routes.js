const commentPayloadSchema = require('../comment/validator/CommentPayloadSchema');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    options: {
      auth: 'jwt_auth',
      validate: {
        payload: commentPayloadSchema,
        failAction: (request, h, err) => {
          throw err;
        }
      }
    },
    handler: handler.postReplyhandler,
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    options: {
      auth: 'jwt_auth',
    },
    handler: handler.deleteReplyhandler,
  },
]);

module.exports = routes;
