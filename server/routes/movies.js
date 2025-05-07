const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movieController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', movieController.getMovies);
router.get('/:id', movieController.getMovieById);
router.post('/:id/rate', verifyToken, movieController.rateMovie);

module.exports = router;
