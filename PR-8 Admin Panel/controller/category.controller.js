const Category = require("../model/category.model");
const Subcategory = require("../model/subcategory.model");
const Extrasubcategory = require("../model/extrasubcategory.model");
const Product = require("../model/product.model");
const fs = require("fs");
const path = require("path");

exports.addcategorypage = async (req, res) => {
    try {
        return res.render("category/add-category");
    }
    catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
}

exports.addcategory = async (req, res) => {
    try {
        let imagepath = req.file ? `/uploads/${req.file.filename}` : "";
        let category = await Category.create({
            ...req.body,
            CategoryImage: imagepath
        })
        if (!category) {
            req.flash("error", "category not found");
            return res.redirect("/category/add-category");
        }
        req.flash("success", "category add sucessfully");
        return res.redirect("/category/view-category");

    }
    catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
}

exports.viewcategory = async (req, res) => {
    try {
        let category = await Category.find();
        return res.render("category/view-category", { category });
    }
    catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
}

exports.deletecategory = async (req, res) => {
    try {
        let id = req.params.id;
        let category = await Category.findById(id);
        if (!category) {
            console.log("category not found");
        }
        let filepath = "";
        if (category.CategoryImage != "") {
            filepath = path.join(__dirname, "..", category.CategoryImage);
        }
        try {
            await fs.unlinkSync(filepath);
        }
        catch (err) {
            console.log("file is missing");
        }
        await Category.findByIdAndDelete(id);
        await Subcategory.deleteMany({ CategoryId: id });
        await Extrasubcategory.deleteMany({ CategoryId: id });
        await Product.deleteMany({ CategoryId: id });
        req.flash("success", "Category Deleted Successfully");
        return res.redirect("/category/view-category");

    }
    catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
}

exports.editcategory = async (req, res) => {
    try {
        let id = req.params.id;
        let category = await Category.findById(id);
        return res.render("category/edit-category", { category });

    }
    catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
}

exports.updatecategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);
        if (!category) {
            console.log("category not found");
        }
        let filepath = "";
        if (req.file) {
            if (category.CategoryImage != "") {
                filepath = path.join(__dirname, "..", category.CategoryImage);
                try {
                    await fs.unlinkSync(filepath);
                }
                catch (err) {
                    console.log("file is missing");
                }
            }
            filepath = `/uploads/${req.file.filename}`;
        }
        else {
            filepath = category.CategoryImage;
        }
        category = await Category.findByIdAndUpdate(category._id, { ...req.body, CategoryImage: filepath }, { new: true });
        if (category) {
            req.flash("success", "Category Updated Successfully");
            return res.redirect("/category/view-category");
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
}