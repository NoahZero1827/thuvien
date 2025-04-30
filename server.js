const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
const mongoURI = 'mongodb+srv://noahzero1827:Lyphuchoa1827@cluster0.rjswawl.mongodb.net/librarydb?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Định nghĩa schema sách
const bookSchema = new mongoose.Schema({
  bookId: { type: String, required: true },
  bookTitle: String,
  author: String,
  year: Number,
  category: String
});
bookSchema.index({ bookTitle: 'text' }); // Hỗ trợ tìm kiếm

const Book = mongoose.model('Book', bookSchema);

// Lấy danh sách category duy nhất
app.get('/categories', async (req, res) => {
  try {
    const categories = await Book.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API tìm kiếm sách (theo từ khóa và/hoặc category)
app.get('/search', async (req, res) => {
  const keyword = req.query.q || '';
  const category = req.query.category || '';

  const start = Date.now(); // Bắt đầu tính thời gian xử lý

  try {
    let query = {};

    if (keyword) {
      query.bookTitle = { $regex: keyword, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const books = await Book.find(query).limit(1000); // Giới hạn 1000 kết quả
    const serverTime = Date.now() - start;

    res.json({ books, serverTime });
  } catch (err) {
    console.error('Error:', err);
    res.status(700).json({ message: err.message });
  }
});

// Gửi file giao diện nếu chạy local
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
