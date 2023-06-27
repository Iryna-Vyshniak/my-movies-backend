// const moviesService = require('../models/movies');
const { Movie } = require('../models/movie');

const { HttpError } = require('../helpers');
// const { isValidId } = require('../middlewares');

const { ctrlWrapper } = require('../decorators');

// add movie`s owner and get movies who added them
// add populate() - інструмент пошуку для поширення запиту - в колекції знаходить поле owner і замінює його розширеними даними
const getAllMovies = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Movie.find({ owner }, '-createdAt -updatedAt').populate(
    'owner',
    'name email'
  );
  res.json(result);
};

/*  GET api/movies

populate('owner') =>
"owner": {
            "_id": "649b26b1566b2b32f187865b",
            "name": "Alex",
            "email": "alex@gmail.com",
            "password": "$2a$10$BvzBjdg9hh1yP1nf1BP4/OpquwG7Yff3hmQinfl.WWKEJXSBAjaNG",
            "token": "",
            "createdAt": "2023-06-27T18:13:05.485Z",
            "updatedAt": "2023-06-27T18:13:05.485Z"
        } */

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
