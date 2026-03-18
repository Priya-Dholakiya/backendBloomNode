const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    Blogtitle: {
      type: String,
      required: true,
    },
    Blogdescription: {
      type: String,
    },
    BlogImage: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Blog", blogSchema);
