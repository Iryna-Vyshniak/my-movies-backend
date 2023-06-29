const express = require('express');

const moviesController = require('../../controllers/movies-controllers');
const { schemas } = require('../../models/movie');
const { validateBody } = require('../../decorators');
const { isValidId, authenticate } = require('../../middlewares');

const router = express.Router();

// add authentication middlewares - check login user - bearer and token, protect every request

router.get('/', authenticate, moviesController.getAllMovies);

router.get('/:id', authenticate, isValidId, moviesController.getMovieById);

router.post('/', authenticate, validateBody(schemas.movieAddSchema), moviesController.addMovie);

router.put(
  '/:id',
  authenticate,
  isValidId,
  validateBody(schemas.movieAddSchema),
  moviesController.updateMovieById
);

router.patch(
  '/:id/favorite',
  authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  moviesController.updateStatusMovie
);

router.delete('/:id', authenticate, isValidId, moviesController.deleteMovieById);

module.exports = router;
