const Joi = require('joi');

const SongsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().required(),
  albumId: Joi.string(),
});
module.exports = { SongsPayloadSchema };
