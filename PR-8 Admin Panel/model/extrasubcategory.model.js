const mongoose = require("mongoose");

const extrasubcategorySchema = new mongoose.Schema(
  {
    Extrasubcategoryname: {
      type: String,
      required: true,
    },
    Extrasubcategorydescription: {
      type: String,
    },
    ExtrasubcategoryImage: {
      type: String,
    },
    CategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    SubCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Extrasubcategory", extrasubcategorySchema);
