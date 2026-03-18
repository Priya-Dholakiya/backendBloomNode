const Extrasubcategory = require("../model/extrasubcategory.model");
const Subcategory = require("../model/subcategory.model");
const Category = require("../model/category.model");
const Product = require("../model/product.model");

exports.getsubcategory = async (req, res) => {
  try {
    let subcategories = await Subcategory.find({ CategoryId: req.params.id });
    return res.json({ message: "success", data: subcategories });
  } catch (err) {
    console.log(err);
    return res.json({ message: "server error", err: err.message });
  }
};

exports.addextrasubcategorypage = async (req, res) => {
  try {
    let categories = await Category.find();

    return res.render("extrasubcategory/add-extrasubcategory", { categories });
  } catch (err) {
    console.log(err);
    req.flash("error", "Failed to load extrasubcategory page");
    req.flash("error", `Failed to add extrasubcategory: ${err.message}`);
    return res.redirect("/extrasubcategory/add-extrasubcategory");
  }
};

exports.addextrasubcategory = async (req, res) => {
  try {
    // console.log(req.body);
    if (req.file) {
      req.body.ExtrasubcategoryImage = req.file.path;
    }
    let extrasubcategory = await Extrasubcategory.create(req.body);
    req.flash("success", "extrasubcategory added successfully");
    return res.redirect("/extrasubcategory/add-extrasubcategory");
  } catch (err) {
    console.log(err);
    req.flash("error", `Failed to add extrasubcategory: ${err.message}`);
    return res.redirect("/extrasubcategory/add-extrasubcategory");
  }
};

exports.viewextrasubcategorypage = async (req, res) => {
  try {
    let extrasubcategoryes = await Extrasubcategory.find()
      .populate("CategoryId")
      .populate("SubCategoryId");

    return res.render("extrasubcategory/view-extrasubcategory", {
      extrasubcategoryes,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

exports.deletesubcategory = async (req, res) => {
  try {
    let id = req.params.id;
    let extrasubcategory = await Extrasubcategory.findById(id);
    if (!extrasubcategory) {
      req.flash("error", "extrasubcategory not found");
      return res.redirect("/extrasubcategory/view-extrasubcategory");
    }
    await Product.deleteMany({ ExtraSubCategoryId: extrasubcategory._id });
    await Extrasubcategory.findByIdAndDelete(id);
    req.flash("success", "extrasubcategory deleted successfully");
    return res.redirect("/extrasubcategory/view-extrasubcategory");
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

exports.editsubcategory = async (req, res) => {
  try {
    let id = req.params.id;
    let extrasubcategory = await Extrasubcategory.findById(id);
    let categories = await Category.find();
    let subcategories = await Subcategory.find();
    return res.render("extrasubcategory/edit-extrasubcategory", {
      extrasubcategory,
      categories,
      subcategories,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

exports.updatesubcategory = async (req, res) => {
  try {
    let id = req.params.id;
    let extrasubcategory = await Extrasubcategory.findByIdAndUpdate(
      id,
      req.body,
    );
    if (!extrasubcategory) {
      req.flash("error", "extrasubcategory not found");
      return res.redirect("/extrasubcategory/view-extrasubcategory");
    }
    req.flash("success", "extrasubcategory updated successfully");
    return res.redirect("/extrasubcategory/view-extrasubcategory");
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};
