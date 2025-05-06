const jwt = require('jsonwebtoken');
const User = require('../models/User'); // <-- importante para buscar o nome do utilizador

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token não fornecido' });

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Utilizador inválido' });

    req.user = user; // 👈 fica disponível como req.user._id e req.user.name
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = protect;
