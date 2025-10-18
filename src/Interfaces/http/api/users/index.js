const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  register: async (server, { container }) => {
    const userHandler = new UsersHandler(container);
    server.route(routes(userHandler));
  },
};