const express = require('express');
const Joi = require('joi');

const {
  getAllMovies,
  getMovieById,
  addMovie,
  updateMovieById,
  deleteMovieById,
} = require('../../models/movies/index');

const { HttpError } = require('../../helpers');

const router = express.Router();

const movieAddSchema = Joi.object({
  title: Joi.string().required(),
  director: Joi.string().required().messages({ 'any.required': `director must be exists` }),
});

//  '/' => /api/movies/
router.get('/', async (req, res, next) => {
  try {
    const movies = await getAllMovies();
    res.json(movies);
  } catch (error) {
    next(error);
    // res.status(500).json({
    //   message: 'Server error',
    // });
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getMovieById(id);
    // if null
    if (!result) {
      throw HttpError(404, `Movie with id=${id} not found`);

      //   const error = new Error(`Movie with id=${id} not found`);
      //   error.status = 404;
      //   throw error;
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { body } = req;
    const { error } = movieAddSchema.validate(body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await addMovie(body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { body } = req;
    const { id } = req.params;
    const { error } = movieAddSchema.validate(body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await updateMovieById(id, body);
    if (!result) {
      throw HttpError(404, `Movie with id=${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteMovieById(id);
    if (!result) {
      throw HttpError(404, `Movie with ${id} not found`);
    }
    // res.status(204).send()
    res.json({
      message: 'Delete success',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
