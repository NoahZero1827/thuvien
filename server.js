const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Cập nhật kết nối MongoDB Atlas (cloud)
const mongoURI = 'mongodb+srv://noahzero1827:Lyphuchoa1827@cluster0.rjswawl.mongodb.net/librarydb?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Schema sách
const bookSchema = new mongoose.Schema({
  bookId: { type: String, required: true },
  bookTitle: String,
  author: String,
  year: Number,
  category: String
});

bookSchema.index({ bookTitle: 'text' }); // Index cho tìm kiếm

const Book = mongoose.model('Book', bookSchema);

// API lấy danh sách category
app.get('/categories', async (req, res) => {
  try {
    const categories = await Book.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API tìm kiếm sách
app.get('/search', async (req, res) => {
  const keyword = req.query.q || '';
  const category = req.query.category || '';

  try {
    let query = {};

    if (keyword) {
      query.bookTitle = { $regex: keyword, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const books = await Book.find(query).limit(100);
    res.json(books);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Phục vụ file index.html (frontend)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Khởi động server
const PORT = process.env.PORT || 3000; // Tự động lựa chọn cổng nếu deploy trên môi trường cloud
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
