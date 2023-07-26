const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsPlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongsToPlaylists(playlistsId, songId) {
    const id = `playlistsong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistsId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSongsPlaylistId(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer 
      FROM songs LEFT JOIN playlists_songs ON 
      songs.id = playlists_songs.songs_id 
      WHERE playlists_songs.playlists_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('lagu playlists tidak ditemukan');
    }
    return result.rows;
  }

  async deleteSongsPlaylistId(playlistsId, songId) {
    const query = {
      text: 'DELETE FROM playlists_songs WHERE songs_id = $1 AND playlists_id = $2 RETURNING id',
      values: [songId, playlistsId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw NotFoundError('Lagu tidak ditemukan. Gagal menghapus lagu!');
    }
  }

  async verifySongs(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return result.rows[0];
  }
}
module.exports = SongsPlaylistsService;
