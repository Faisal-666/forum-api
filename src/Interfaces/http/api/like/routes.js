const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    options: {
      auth: 'jwt_auth',
    },
    handler: handler.putLikehandler,
  },
]);

module.exports = routes;
