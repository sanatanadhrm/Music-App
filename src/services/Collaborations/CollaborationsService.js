const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(playlistsId, userId) {
    const id = `collabs-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES ($1,$2,$3) RETURNING id',
      values: [id, playlistsId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan kolaborasi');
    }
    return result.rows[0].id;
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlists_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }

  async deleteCollaboration(playlistsId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlists_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistsId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
  }
}
module.exports = CollaborationsService;
