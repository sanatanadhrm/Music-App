const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postPlaylistsHandler(request, h) {
    this._validator.validatePlaylistssPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: owner } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(owner);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistsHandler(request) {
    const { id: owner } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._service.verifyPlaylistOwner(playlistId, owner);
    await this._service.deletePlaylistById(playlistId);
    return {
      status: 'success',
      message: 'Playlist berhasil di hapus',
    };
  }
}
module.exports = PlaylistsHandler;
