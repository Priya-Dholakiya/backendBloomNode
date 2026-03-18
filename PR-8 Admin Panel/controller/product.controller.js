const Category = require("../model/category.model");
const Subcategory = require("../model/subcategory.model");
const Extrasubcategory = require("../model/extrasubcategory.model");
const Product = require("../model/product.model");
const fs = require("fs");
const path = require("path");

exports.getsubcategory = async (req, res) => {
  try {
    let subcategories = await Subcategory.find({ CategoryId: req.params.id });
    return res.json({ message: "success", data: subcategories });
  } catch (err) {
    console.log(err);
    return res.json({ message: "server error", err: err.message });
  }
};

exports.getextrasubcategory = async (req, res) => {
  try {
    let extrasubcategory = await Extrasubcategory.find({
      SubCategoryId: req.params.id,
    });
    return res.json({ message: "success", data: extrasubcategory });
  } catch (err) {
    console.log(err);
    return res.json({ message: "server error", err: err.message });
  }
};

exports.addproductpage = async (req, res) => {
  try {
    let categories = await Category.find();
    return res.render("product/add-product", { categories });
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

exports.addproduct = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    let imagepath = req.file ? `/uploads/${req.file.filename}` : "";

    const productData = {
      ProductName: req.body.ProductName,
      discription: req.body.discription,
      Brand: req.body.Brand,
      Productprice: parseFloat(req.body.Productprice),
      CategoryId: req.body.CategoryId,
      SubCategoryId: req.body.SubCategoryId,
      ExtraSubCategoryId: req.body.ExtraSubCategoryId,
      ProductImage: imagepath,
    };

    console.log("Creating product with data:", productData);

    let product = await Product.create(productData);
    req.flash("success", "product added successfully");
    return res.redirect("/product/view-product");
  } catch (err) {
    console.log("Error creating product:", err);
    req.flash("error", `Failed to add product: ${err.message}`);
    return res.redirect("/product/add-product");
  }
};

exports.viewproduct = async (req, res) => {
  try {
    let products = await Product.find()
      .populate("CategoryId")
      .populate("SubCategoryId")
      .populate("ExtraSubCategoryId")
      .lean();
    return res.render("product/view-product", { products });
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

exports.deleteproduct = async (req, res) => {
  try {
    let id = req.params.id;
    let product = await Product.findById(id);
    if (!product) {
      req.flash("error", "product not found");
      return res.redirect("/product/view-product");
    }
    let filepath = "";
    if (product.ProductImage != "") {
      filepath = path.join(__dirname, "..", product.ProductImage);
    }
    try {
      await fs.unlinkSync(filepath);
    } catch (err) {
      console.log("file is missing");
    }

    await Product.findByIdAndDelete(id);
    req.flash("success", "product deleted successfully");
    return res.redirect("/product/view-product");
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

exports.editproductpage = async (req, res) => {
  try {
    let id = req.params.id;
    let product = await Product.findById(id);
    let categories = await Category.find();
    let subcategories = await Subcategory.find();
    let extrasubcategoryes = await Extrasubcategory.find();
    return res.render("product/edit-product", {
      product,
      categories,
      subcategories,
      extrasubcategoryes,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

exports.updateproduct = async (req, res) => {
  try {
    let id = req.params.id;
    let product = await Product.findByIdAndUpdate(id, req.body);
    if (!product) {
      req.flash("error", "product not found");
      return res.redirect("/product/view-product");
    }
    let filepath = "";
    if (req.file) {
      if (product.ProductImage != "") {
        filepath = path.join(__dirname, "..", product.ProductImage);
        try {
          await fs.unlinkSync(filepath);
        } catch (err) {
          console.log("file is missing");
        }
      }
      filepath = `/uploads/${req.file.filename}`;
    } else {
      filepath = product.ProductImage;
    }
    product = await Product.findByIdAndUpdate(
      id,
      { ...req.body, ProductImage: filepath },
      { new: true },
    );
    if (product) {
      req.flash("success", "product updated successfully");
      return res.redirect("/product/view-product");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};
