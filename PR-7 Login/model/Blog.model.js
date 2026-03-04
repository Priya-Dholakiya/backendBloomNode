const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: String,
  shortDes: String,
  content: {
    required: true,
    type: String
  },
  category: String,
  coverImage: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Blog", blogSchema);
