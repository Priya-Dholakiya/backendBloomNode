const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    ProductName: {
      type: String,
      required: true,
    },
    discription: {
      type: String,
      required: true,
    },
    ProductImage: {
      type: String,
    },
    CategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    SubCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    ExtraSubCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Extrasubcategory",
      required: true,
    },
    Productprice: {
      type: Number,
      required: true,
    },
    Brand: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
