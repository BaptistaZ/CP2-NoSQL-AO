const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const {
  getProfile,
  getFavorites,
  toggleFavorite
} = require('../controllers/userController');

router.get('/me', protect, getProfile);
router.get('/favorites', protect, getFavorites);
router.post('/favorites', protect, toggleFavorite);

module.exports = router;
