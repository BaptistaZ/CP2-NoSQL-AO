// controllers/movieController.js
const mongoose = require('mongoose'); 
const Movie = require('../models/Movie');

const getMovies = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const genre = req.query.genre || '';

  const skip = (page - 1) * limit;

  const filter = {};

  // 🔍 Pesquisa por título (ou outros campos se quiseres)
  if (search) {
    filter.title = { $regex: new RegExp(search, 'i') };
  }

  // 🎭 Filtrar por género
  if (genre) {
    filter.genres = genre;
  }

  try {
    const total = await Movie.countDocuments(filter);
    const movies = await Movie.find(filter).skip(skip).limit(limit);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      movies
    });
  } catch (error) {
    console.error("Erro no getMovies:", error);
    res.status(500).json({ message: error.message });
  }
};

const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const Comment = mongoose.connection.collection('comments');

    // 👇 Converte o ID para ObjectId antes de fazer a query
    const comments = await Comment.find({ movie_id: new mongoose.Types.ObjectId(id) }).toArray();

    res.json({ ...movie.toObject(), comments });
  } catch (error) {
    console.error("Erro no getMovieById:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Exporta corretamente
module.exports = {
  getMovies,
  getMovieById
};
