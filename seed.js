const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker'); // npm install @faker-js/faker

mongoose.connect('mongodb://localhost:27017/librarydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// Schema
const bookSchema = new mongoose.Schema({
  bookId: { type: String, unique: true }, // Khác trước: thêm unique
  bookTitle: String,
  author: String,
  year: Number,
  category: String
});

const Book = mongoose.model('Book', bookSchema);

async function seedBooks() {
  await Book.deleteMany({}); // Xóa trước nếu có
  
  const books = [];

  for (let i = 0; i < 10000; i++) {
    books.push({
      bookId: `B${i}`, // B0, B1, B2, ..., B9999
      bookTitle: faker.lorem.words(3),
      author: faker.person.fullName(),
      year: faker.date.past().getFullYear(),
      category: faker.commerce.department()
    });
  }

  try {
    await Book.insertMany(books);
    console.log('Seed 10.000 sách thành công!');
  } catch (err) {
    console.error('Lỗi khi seed:', err);
  } finally {
    mongoose.connection.close();
  }
}

seedBooks();
