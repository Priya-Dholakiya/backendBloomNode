const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    Subcategoryname: {
      type: String,
      required: true,
    },
    Subcategorydescription: {
      type: String,
    },
    SubcategoryImage: {
      type: String,
    },
    CategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Subcategory", subcategorySchema);
