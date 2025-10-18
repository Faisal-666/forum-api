const routes = require('./routes');
const ThreadsHandler = require('./handler');

module.exports = {
  name: 'threads',
  register: async (server, { container }) => {
    const threadHandler = new ThreadsHandler(container);
    server.route(routes(threadHandler));
  },
};