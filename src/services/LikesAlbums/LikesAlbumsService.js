const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
// const { mapDBToModel } = require('../../utils');
// const NotFoundError = require('../../exceptions/NotFoundError');

class LikesAlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLikesAlbum(userId, albumId) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO likes_album VALUES($1, $2, $3) RETURNING id',
      values: [id, albumId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('likes gagal ditambahkan');
    }
    await this._cacheService.delete(`albums:${albumId}`);
    return result.rows[0].id;
  }

  async getLikesAlbum(albumId) {
    try {
      const result = await this._cacheService.get(`albums:${albumId}`);
      return [JSON.parse(result), true];
    } catch (error) {
      const query = {
        text: 'SELECT * FROM likes_album WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      await this._cacheService.set(`albums:${albumId}`, JSON.stringify(result.rowCount));
      return [result.rowCount, false];
    }
  }

  async deleteLikeAlbum(userId, albumId) {
    const query = {
      text: 'DELETE FROM likes_album WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('likes gagal dihapus');
    }
    await this._cacheService.delete(`albums:${albumId}`);
    return result.rows[0].id;
  }

  async verifyLikesAlbum(userId, albumId) {
    const query = {
      text: 'SELECT * FROM likes_album WHERE user_id = $1 AND album_Id = $2',
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);
    if (result.rows.length) {
      throw new InvariantError('user sudah melakukan likes');
    }
  }
}
module.exports = LikesAlbumsService;
