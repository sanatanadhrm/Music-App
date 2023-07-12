/* eslint-disable max-len */
const SongsPlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'songsplaylists',
  version: '1.0.0',
  register: async (server, {
    songsplaylistsService, playlistsService, activitiesService, validator,
  }) => {
    const songsplaylistsHandler = new SongsPlaylistsHandler(songsplaylistsService, playlistsService, activitiesService, validator);
    server.route(routes(songsplaylistsHandler));
  },
};
