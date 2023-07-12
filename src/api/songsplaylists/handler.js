const autoBind = require('auto-bind');

class SongsPlaylistsHandler {
  constructor(songsplaylistsService, playlistsService, activitiesService, validator) {
    this._SongsPlaylistsService = songsplaylistsService;
    this._PlaylistsService = playlistsService;
    this._ActivitiesService = activitiesService;
    this._validator = validator;
    autoBind(this);
  }

  async postSongPlaylistsHandler(request, h) {
    this._validator.validateSongsPlaylistssPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistsId } = request.params;
    const { id: owner } = request.auth.credentials;
    const action = 'add';

    await this._PlaylistsService.verifyPlaylistAccess(playlistsId, owner);
    await this._SongsPlaylistsService.verifySongs(songId);
    await this._SongsPlaylistsService.addSongsToPlaylists(playlistsId, songId);
    await this._ActivitiesService.addActivites({
      playlistsId, songId, userId: owner, action,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async getSongPlaylistsHandler(request) {
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._PlaylistsService.verifyPlaylistAccess(playlistId, owner);

    const playlist = await this._PlaylistsService.getPlaylistsById(owner, playlistId);
    const songs = await this._SongsPlaylistsService.getSongsPlaylistId(playlistId);
    return {
      status: 'success',
      data: {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          username: playlist.username,
          songs,
        },
      },
    };
  }

  async deleteSongPlaylistsHandler(request) {
    this._validator.validateSongsPlaylistssPayload(request.payload);

    const { id: playlistsId } = request.params;
    const { songId } = request.payload;
    const { id: owner } = request.auth.credentials;
    const action = 'delete';

    await this._PlaylistsService.verifyPlaylistAccess(playlistsId, owner);
    await this._SongsPlaylistsService.deleteSongsPlaylistId(playlistsId, songId);
    await this._ActivitiesService.addActivites({
      playlistsId, songId, userId: owner, action,
    });
    return {
      status: 'success',
      message: 'Lagu berhasil di hapus dari playlist',
    };
  }
}
module.exports = SongsPlaylistsHandler;
