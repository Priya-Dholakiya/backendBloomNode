const Category = require("../model/category.model");
const Subcategory = require("../model/subcategory.model");
const Extrasubcategory = require("../model/extrasubcategory.model");
const Product = require("../model/product.model");

exports.addsubcategorypage = async (req, res) => {
  try {
    let categories = await Category.find();
    return res.render("subcategory/add-subcategory", { categories });
  } catch (err) {
    console.log(err);
    req.flash("error", "Failed to load add subcategory page");
    return res.redirect("/dashboard");
  }
};

exports.addsubcategory = async (req, res) => {
  try {
    console.log(req.body);
    if (req.file) {
      req.body.SubcategoryImage = req.file.path;
    }
    let subcategory = await Subcategory.create(req.body);
    req.flash("success", "subcategory added successfully");
    return res.redirect("/subcategory/add-subcategory");
  } catch (err) {
    console.log(err);
    req.flash("error", `Failed to add subcategory: ${err.message}`);
    return res.redirect("/subcategory/add-subcategory");
  }
};

exports.viewsubcategory = async (req, res) => {
  try {
    let subcategory = await Subcategory.find().populate("CategoryId");
    console.log("sub: ", subcategory);

    return res.render("subcategory/view-subcategory", { subcategory });
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

exports.deletesubcategory = async (req, res) => {
  try {
    let id = req.params.id;
    let subcategory = await Subcategory.findById(id);
    if (!subcategory) {
      req.flash("error", "subcategory not found");
      return res.redirect("/subcategory/view-subcategory");
    }
    await Extrasubcategory.deleteMany({ SubCategoryId: subcategory._id });
    await Product.deleteMany({ SubCategoryId: subcategory._id });
    await Subcategory.findByIdAndDelete(id);
    req.flash("success", "subcategory deleted successfully");
    return res.redirect("/subcategory/view-subcategory");
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

exports.editsubcategory = async (req, res) => {
  try {
    let id = req.params.id;
    let subcategory = await Subcategory.findById(id);
    let categories = await Category.find();
    return res.render("subcategory/edit-subcategory", {
      subcategory,
      categories,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

exports.updatesubcategory = async (req, res) => {
  try {
    let id = req.params.id;
    let subcategory = await Subcategory.findByIdAndUpdate(id, req.body);
    if (!subcategory) {
      req.flash("error", "subcategory not found");
      return res.redirect("/subcategory/view-subcategory");
    }
    req.flash("success", "subcategory updated successfully");
    return res.redirect("/subcategory/view-subcategory");
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};
