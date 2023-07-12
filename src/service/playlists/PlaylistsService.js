const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationsService) {
    this._collaborationService = collaborationsService;
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT a.id, a.name, b.username FROM playlists AS a 
      LEFT JOIN users AS b ON (a.owner = b.id) LEFT JOIN 
      collaborations AS c ON (c.playlists_id = a.id) 
      WHERE a.owner = $1 OR c.user_id = $1`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    console.log(result.rows[0]);
    return result.rows;
  }

  async getPlaylistsById(owner, playlistId) {
    const query = {
      text: `SELECT a.id, a.name, b.username FROM playlists AS a 
      LEFT JOIN users AS b ON (a.owner = b.id) 
      LEFT JOIN collaborations AS c ON (c.playlists_id = a.id) 
      WHERE (a.owner = $1 AND a.id = $2) OR 
      (c.user_id = $1 AND c.playlists_id = $2);`,
      values: [owner, playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('playlists tidak ditemukan');
    }
    return result.rows[0];
  }

  async verifyPlaylistOwner(playlistsId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistsId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlists tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses Playlist ini.');
    }
  }

  async verifyPlaylistAccess(noteId, userId) {
    try {
      await this.verifyPlaylistOwner(noteId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(noteId, userId);
      } catch {
        throw error;
      }
    }
  }

  async verifyUserExist(userId) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }

  async deletePlaylistById(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus');
    }
  }
}
module.exports = PlaylistsService;
