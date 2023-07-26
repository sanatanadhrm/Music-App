const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this.__validator = validator;
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this.__validator.validateAlbumsPayload(request.payload);
    const { name, year } = request.payload;
    const albumid = await this._service.addAlbum({ name, year });
    const response = h.response({
      status: 'success',
      massage: 'catatan berhasil',
      data: {
        albumId: albumid,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const song = await this._service.getSongsByAlbumId(id);
    return {
      status: 'success',
      data: {
        album: {
          id: album.id,
          name: album.name,
          year: album.year,
          coverUrl: album.cover,
          songs: song,
        },
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this.__validator.validateAlbumsPayload(request.payload);
    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);
    return {
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }
}
module.exports = AlbumsHandler;
