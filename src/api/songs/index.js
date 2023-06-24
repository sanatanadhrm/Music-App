const SongssHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'songss',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songssHandler = new SongssHandler(service, validator);
    server.route(routes(songssHandler));
  },
};
