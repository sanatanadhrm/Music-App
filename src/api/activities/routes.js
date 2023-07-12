const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: handler.getActivitiesHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
];
module.exports = routes;
