const commentPayloadSchema = require('./validator/CommentPayloadSchema');

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    options: {
      auth: 'jwt_auth',
      validate: {
        payload: commentPayloadSchema,
        failAction: (request, h, err) => {
          throw err;
        }
      }
    },
    handler: handler.postCommenthandler,
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    options: {
      auth: 'jwt_auth',
    },
    handler: handler.deleteCommenthandler,
  },
]);

module.exports = routes;
