// const moviesService = require('../models/movies');
const { Movie } = require('../models/movie');

const { HttpError } = require('../helpers');
// const { isValidId } = require('../middlewares');

const { ctrlWrapper } = require('../decorators');

// add movie`s owner and get movies who added them
const getAllMovies = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Movie.find({ owner }, '-createdAt -updatedAt');
  res.json(result);
};

const getMovieById = async (req, res, next) => {
  const { id } = req.params;
  // const result = await Movie.findOne({ _id: id });
  const result = await Movie.findById(id);
  if (!result) {
    throw HttpError(404, `Movie with ${id} not found`);
  }
  res.json(result);
};

// add id owner for every add movies
const addMovie = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Movie.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateMovieById = async (req, res, next) => {
  const { id } = req.params;
  const result = await Movie.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Movie with ${id} not found`);
  }

  res.json(result);
};

// (contactId, body)
const updateStatusMovie = async (req, res, next) => {
  const { id } = req.params;
  const result = await Movie.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Movie with ${id} not found`);
  }

  res.json(result);
};

const deleteMovieById = async (req, res) => {
  const { id } = req.params;
  const result = await Movie.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404, `Movie with ${id} not found`);
  }

  res.json({
    message: 'Delete success',
  });
};

module.exports = {
  getAllMovies: ctrlWrapper(getAllMovies),
  getMovieById: ctrlWrapper(getMovieById),
  addMovie: ctrlWrapper(addMovie),
  updateMovieById: ctrlWrapper(updateMovieById),
  updateStatusMovie: ctrlWrapper(updateStatusMovie),
  deleteMovieById: ctrlWrapper(deleteMovieById),
};
