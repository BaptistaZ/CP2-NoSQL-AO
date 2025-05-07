const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/authRoutes'); 
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config(); 

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'sample_mflix',
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas!');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes); 

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
