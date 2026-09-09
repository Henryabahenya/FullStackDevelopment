const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
  },
  published: {
    type: Number,
  },
  author: {
    type: String,
    required: true,
  },
  genres: [String],
});

module.exports = mongoose.model("Book", bookSchema);
