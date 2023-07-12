const Joi = require('joi');

const SongsPlaylistsPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { SongsPlaylistsPayloadSchema };
