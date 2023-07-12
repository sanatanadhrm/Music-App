const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistsPayloadSchema } = require('./schema');

const PlaylistsValidator = {
  validatePlaylistssPayload: (payload) => {
    const validationResult = PlaylistsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
