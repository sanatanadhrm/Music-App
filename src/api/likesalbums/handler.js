const autoBind = require('auto-bind');

class LikesAlbumsHandler {
  constructor(likesalbumService, albumsService) {
    this._likes = likesalbumService;
    this._albums = albumsService;
    autoBind(this);
  }

  async postLikesAlbumHandler(request, h) {
    const { albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._albums.getAlbumById(albumId);
    await this._likes.verifyLikesAlbum(userId, albumId);
    await this._likes.addLikesAlbum(userId, albumId);
    const response = h.response({
      status: 'success',
      message: 'Album berhasil di Like',
    });
    response.code(201);
    return response;
  }

  async getLikesAlbumHandler(request, h) {
    const { albumId } = request.params;
    const [likes, cache] = await this._likes.getLikesAlbum(albumId);
    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.code(200);
    if (cache) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }

  async deleteLikesAlbumHandler(request) {
    const { albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._likes.deleteLikeAlbum(userId, albumId);
    return {
      status: 'success',
      message: 'Likes berhasil dihapus',
    };
  }
}
module.exports = LikesAlbumsHandler;
