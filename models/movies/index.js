const fs = require('node:fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const moviesPath = path.join(__dirname, 'movies.json');

const updateMovies = async (movies) => {
  return await fs.writeFile(moviesPath, JSON.stringify(movies, null, 2));
};

const getAllMovies = async () => {
  return JSON.parse(await fs.readFile(moviesPath));
};

const getMovieById = async (id) => {
  const movies = await getAllMovies();
  const movie = movies.find((movie) => movie.id === id);
  return movie || null;
};

const addMovie = async (body) => {
  const movies = await getAllMovies();
  const newMovie = {
    id: randomUUID(),
    ...body,
  };

  movies.push(newMovie);
  await updateMovies(movies);
  return newMovie;
};

const updateMovieById = async (id, data) => {
  const movies = await getAllMovies();
  const index = movies.findIndex((m) => m.id === id);

  if (index === -1) return null;

  movies[index] = { id, ...data };
  await updateMovies(movies);
  return movies[index];
};

const deleteMovieById = async (id) => {
  const movies = await getAllMovies();
  const index = movies.findIndex((m) => m.id === id);
  if (index === -1) return null;

  const [result] = movies.slice(index, 1);
  await updateMovies(movies);
  return result;
};

module.exports = { getAllMovies, getMovieById, addMovie, updateMovieById, deleteMovieById };
