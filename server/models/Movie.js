// models/Movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({}, { strict: false }); // permite qualquer campo

module.exports = mongoose.model('Movie', movieSchema, 'movies'); // 👈 nome da coleção é 'movies'
