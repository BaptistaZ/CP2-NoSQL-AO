const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const {
  getFavorites,
  toggleFavorite
} = require('../controllers/userController');

router.get('/favorites', protect, getFavorites);

router.post('/favorites', protect, toggleFavorite);

module.exports = router;
