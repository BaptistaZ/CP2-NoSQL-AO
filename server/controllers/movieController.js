const mongoose = require("mongoose");
const Movie = require("../models/Movie");

const getMovies = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const genre = req.query.genre || "";

  const skip = (page - 1) * limit;
  const filter = {};

  if (search) filter.title = { $regex: new RegExp(search, "i") };
  if (genre) filter.genres = genre;

  try {
    const total = await Movie.countDocuments(filter);
    const movies = await Movie.find(filter).skip(skip).limit(limit);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      movies,
    });
  } catch (error) {
    console.error("Error in getMovies:", error);
    res.status(500).json({ message: error.message });
  }
};

const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const Comment = mongoose.connection.collection("comments");

    const comments = await Comment.find({
      movie_id: new mongoose.Types.ObjectId(id),
    }).toArray();

    res.json({ ...movie.toObject(), comments });
  } catch (error) {
    console.error("Error in getMovieById:", error);
    res.status(500).json({ message: error.message });
  }
};

const rateMovie = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID." });
  }

  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ error: "Invalid assessment value." });
  }

  try {
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ error: "Movie not found." });

    const userId = req.user.id.toString();
    movie.ratings = movie.ratings.filter((r) => r.userId !== userId);
    movie.ratings.push({ userId, value });

    await movie.save();
    res.status(200).json(movie); 
  } catch (err) {
    console.error("Error rating movie:", err);
    res.status(500).json({ error: "Error rating movie." });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  rateMovie,
};
