const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    discription: { type: String, required: true },
    price: { type: Number, required: true },
    author: { type: String, required: true },
    genre: String,
    imagePath: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Book", bookSchema);
