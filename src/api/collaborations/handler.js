const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(playlistsService, collaborationsService, validator) {
    this._PlaylistsService = playlistsService;
    this._CollaborationsService = collaborationsService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationsHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: owner } = request.auth.credentials;
    const { playlistId: playlistsId, userId } = request.payload;
    await this._PlaylistsService.verifyPlaylistOwner(playlistsId, owner);
    await this._PlaylistsService.verifyUserExist(userId);
    const collaborationId = await this._CollaborationsService.addCollaboration(playlistsId, userId);
    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationsHandler(request) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: owner } = request.auth.credentials;
    const { playlistId: playlistsId, userId } = request.payload;

    await this._PlaylistsService.verifyPlaylistOwner(playlistsId, owner);
    await this._CollaborationsService.deleteCollaboration(playlistsId, userId);
    return {
      status: 'success',
      message: 'Berhasil di hapus',
    };
  }
}
module.exports = CollaborationsHandler;
