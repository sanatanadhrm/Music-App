const InvariantError = require('../../exceptions/InvariantError');
const { SongsPlaylistsPayloadSchema } = require('./schema');

const SongsPlaylistsValidator = {
  validateSongsPlaylistssPayload: (payload) => {
    const validationResult = SongsPlaylistsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsPlaylistsValidator;
