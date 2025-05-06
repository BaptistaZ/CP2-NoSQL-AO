const User = require('../models/User');
const Movie = require('../models/Movie');

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter favoritos' });
  }
};

exports.toggleFavorite = async (req, res) => {
  const { movieId } = req.body;

  try {
    const user = await User.findById(req.user.id);

    const isFavorite = user.favorites.includes(movieId);

    if (isFavorite) {
      user.favorites.pull(movieId);
    } else {
      user.favorites.push(movieId);
    }

    await user.save();
    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar favoritos' });
  }
};
