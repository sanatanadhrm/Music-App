const autoBind = require('auto-bind');

class ActivitiesHandler {
  constructor(playlistsService, activitiesService) {
    this._ActivitiesService = activitiesService;
    this._PlaylistsService = playlistsService;
    autoBind(this);
  }

  async getActivitiesHandler(request) {
    const { id: playlistsId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._PlaylistsService.verifyPlaylistOwner(playlistsId, owner);
    const history = await this._ActivitiesService.getActivities(playlistsId);
    return {
      status: 'success',
      data: {
        playlistId: playlistsId,
        activities: [...history],
      },
    };
  }
}
module.exports = ActivitiesHandler;
