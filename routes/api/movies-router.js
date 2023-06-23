const express = require('express');
// const Joi = require('joi');

const moviesController = require('../../controllers/movies-controllers');

const schemas = require('../../schemas/movies-schemas');
const { validateBody } = require('../../decorators');

// const {
//   getAllMovies,
//   getMovieById,
//   addMovie,
//   updateMovieById,
//   deleteMovieById,
// } = require('../../models/movies/index');

// const { HttpError } = require('../../helpers');

const router = express.Router();

// const movieAddSchema = Joi.object({
//   title: Joi.string().required(),
//   director: Joi.string().required().messages({ 'any.required': `director must be exists` }),
// });

//  '/' => /api/movies/
router.get('/', moviesController.getAllMovies);

router.get('/:id', moviesController.getMovieById);

router.post('/', validateBody(schemas.movieAddSchema), moviesController.addMovie);

router.put('/:id', validateBody(schemas.movieAddSchema), moviesController.updateMovieById);

router.delete('/:id', moviesController.deleteMovieById);

module.exports = router;
