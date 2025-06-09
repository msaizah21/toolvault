const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');
const todosRoutes = require('./routes/todosRoutes');
const bookmarksRoutes = require('./routes/bookmarksRoutes');
const authMiddleware = require('./middleware/auth');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', authMiddleware, notesRoutes);
app.use('/api/todos', authMiddleware, todosRoutes);
app.use('/api/bookmarks', authMiddleware, bookmarksRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.log(err));
