const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require('../helpers');

const genreList = ['fantastic', 'love'];
const dateRegexp = /^\d{2}-\d{2}-\d{4}$/; // 16-01-2023

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    genre: {
      type: String,
      enum: genreList,
      required: true,
    },
    date: {
      type: String,
      match: dateRegexp,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

movieSchema.post('save', handleMongooseError);

const movieAddSchema = Joi.object({
  title: Joi.string().required(),
  director: Joi.string().required().messages({ 'any.required': `director must be exists` }),
  favorite: Joi.boolean(),
  genre: Joi.string()
    .valid(...genreList)
    .required(),
  date: Joi.string().pattern(dateRegexp).required(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemas = { movieAddSchema, updateFavoriteSchema };

const Movie = model('movie', movieSchema);

module.exports = {
  Movie,
  schemas,
};
