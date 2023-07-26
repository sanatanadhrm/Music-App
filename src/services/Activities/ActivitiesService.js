const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivites({
    playlistsId, songId, userId, action,
  }) {
    const id = `activities-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlists_songs_activities VALUES($1,$2,$3,$4,$5,$6) RETURNING id',
      values: [id, playlistsId, songId, userId, action, time],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Gagal memasukkan ke history');
    }
  }

  async getActivities(playlistsId) {
    const query = {
      text: `SELECT a.username, b.title, c.action, c.time from users AS a 
            JOIN playlists_songs_activities AS c ON (a.id = c.user_id) 
            JOIN songs AS b ON (b.id = c.song_id) 
             WHERE c.playlist_id = $1 ORDER BY time`,
      values: [playlistsId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw NotFoundError('History tidak ditemukan');
    }
    return result.rows;
  }
}
module.exports = ActivitiesService;
