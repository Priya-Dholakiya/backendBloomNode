const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  moviename: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  img: { type: String, required: true },
});

module.exports = mongoose.model("Movie", movieSchema);
