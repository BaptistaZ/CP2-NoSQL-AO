const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user)
    });
  } catch (err) {
    console.error('Error in registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user)
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
