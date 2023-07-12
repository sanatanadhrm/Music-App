/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlists_songs', {
    id: {
      type: 'VARCHAR(50)',
      notNull: true,
      primaryKey: true,
    },
    playlists_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    songs_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint('playlists_songs', 'fk_playlists_songs.playlists_id_plalists.id', 'FOREIGN KEY(playlists_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlists_songs', 'fk_playlists_songs.songs_id_songs.id', 'FOREIGN KEY(songs_id) REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('playlists_songs');
};
