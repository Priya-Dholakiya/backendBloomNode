const Blog = require("../model/blog.model");
const uploadsimage = require("../middleware/image.uploads");
const path = require("path");
const fs = require("fs");

exports.getdashboard = ((req, res) => {
    try {
        return res.render("dashboard");
    }
    catch (err) {
        console.log(err);
    }
})

exports.addblogpage = ((req, res) => {
    try {
        return res.render("blogs/add-blog");
    }
    catch (err) {
        console.log(err);
    }
})

exports.addblog = async (req, res) => {
    try {
        let imagepath = "";
        if (req.file) {
            console.log(req.file);
            imagepath = `/uploads/${req.file.filename}`
        }
        let blog = await Blog.create({
            ...req.body,
            BlogImage: imagepath
        });
        req.flash("success", "blog added successfully");
        return res.redirect("/blogs/add-blog");
    }
    catch (err) {
        console.log(err);
        return res.redirect("/")
    }
}

exports.viewblog = async (req, res) => {
    try {
        let blog = await Blog.find();
        return res.render("blogs/view-blog", { blog });
    }
    catch (err) {
        console.log(err);
        return res.redirect("/")
    }
}

exports.deleteblog = async (req, res) => {
    try {
        let id = req.params.id;
        let blog = await Blog.findById(id);
        if (!blog) {
           req.flash("error", "blog not found");
            return res.redirect("/blogs/view-blog");
        }
        let filepath = "";
        if (blog.BlogImage != "") {
            filepath = path.join(__dirname, "..", blog.BlogImage);
        }
        try {
            await fs.unlinkSync(filepath);
        }
        catch (err) {
          req.flash("error", "fille is missing");
          
        }
        await Blog.findByIdAndDelete(id);
        req.flash("success", "blog deleted successfully");
        return res.redirect("/blogs/view-blog");


    }
    catch (err) {
        console.log(err);
        return res.redirect("/")
    }
}

exports.editblog = async (req, res) => {
    try {
        let id = req.params.id;
        let blog = await Blog.findById(id);
        return res.render("blogs/edit-blog", { blog });
    }
    catch (err) {
        console.log(err);
        return res.redirect("/")
    }
}

exports.updateblog = async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);
        if (!blog) {
            console.log("blog not found");
        }
        let filepath = "";
        if (req.file) {
            if (blog.BlogImage != "") {
                filepath = path.join(__dirname, "..", blog.BlogImage);
                try {
                    await fs.unlinkSync(filepath);
                }
                catch (err) {
                    console.log("fille is missing");
                }
            }
            filepath = `/uploads/${req.file.filename}`;
        }
        else {
            filepath = Blog.BlogImage;
        }
        blog = await Blog.findByIdAndUpdate(blog._id, { ...req.body, BlogImage: filepath }, { new: true });
        if (blog) {
            req.flash("success", "blog updated successfully");
            return res.redirect("/blogs/view-blog");
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect("/")
    }
}

exports.view = async (req, res) => {
    try {
        let id = req.params.id;
        let blog = await Blog.findById(id);
        return res.render("blogs/view", { blog });
    }
    catch (err) {
        console.log(err);
        return res.redirect("/")
    }
}