const Joi = require('joi');

const movieAddSchema = Joi.object({
  title: Joi.string().required(),
  director: Joi.string().required().messages({ 'any.required': `director must be exists` }),
});

module.exports = {
  movieAddSchema,
};
