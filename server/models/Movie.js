const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

const movieSchema = new mongoose.Schema({
  title: String,
  poster: String,
  year: String,
  genres: [String],
  plot: String,
  cast: [String],
  runtime: Number,
  imdb: {
    rating: Number,
    votes: Number,
  },
  ratings: [ratingSchema], 
}, { strict: false });

module.exports = mongoose.model('Movie', movieSchema, 'movies');
