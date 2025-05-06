const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const {
  getFavorites,
  toggleFavorite
} = require('../controllers/userController');

// Obter favoritos do utilizador autenticado
router.get('/favorites', protect, getFavorites);

// Adicionar/remover favorito (toggle)
router.post('/favorites', protect, toggleFavorite);

module.exports = router;
