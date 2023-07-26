const LikesAlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likes',
  version: '1.0.0',
  register: async (server, {
    likesalbumService,
    albumsService,
  }) => {
    const likesalbumsHandler = new LikesAlbumsHandler(
      likesalbumService,
      albumsService,
    );
    server.route(routes(likesalbumsHandler));
  },
};
