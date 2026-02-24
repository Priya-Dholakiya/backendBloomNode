const Blog = require("../model/Blog.model");
const fs = require("fs");
exports.addblogPage = async (req, res) => {
  return res.render("blog/addblog");
};
exports.addblog = async (req, res) => {
  try {
    let imagePath = req.file ? "uploads/" + req.file.filename : "";
    await Blog.create({
      ...req.body,
      coverImage: imagePath
    });
    return res.redirect("/blog/viewblog"); 
  } catch (error) {
    console.log(error);
    return res.redirect("/dashboard");
  }
};
exports.viewAllblogs = async (req, res) => {
  try {
    let filter = {};
    const searchQuery = req.query.search;
    const selectedCategory = req.query.category;
  if(searchQuery) {
      filter.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } }
      ];
    }
    if(selectedCategory) {
      filter.category = selectedCategory;
      }
    const blogs = await Blog.find(filter).sort({ date: -1 });
  return res.render("blog/viewblog", { blogs, searchQuery, selectedCategory });
  } catch (error) {
    console.log(error);
    return res.redirect("/dashboard");
  }
};
exports.editblog = async (req, res) => {
  try {
    const blogData = await Blog.findById(req.params.id);
  return res.render("blog/editblog", { blogData });
  } catch (error) {
    console.log(error);
  return res.redirect("/blog/viewblog");
  }
};
exports.updateblog = async (req, res) => {
  try {
    const blogData = await Blog.findById(req.params.id);
    let imagePath = blogData.coverImage;
    if (req.file) {
      if (blogData.coverImage) {
        try {
          fs.unlinkSync(blogData.coverImage);
      } catch (err) {
          console.log("Old image not found, skipping delete");
        }
      }
    imagePath = "uploads/" + req.file.filename;
    }
    await Blog.findByIdAndUpdate(req.params.id, {
      ...req.body,
      coverImage: imagePath
    });
    return res.redirect("/blog/viewblog");
  } catch (error) {
      console.log(error);
    return res.redirect("/blog/viewblog");
  }
};
exports.deleteblog = async (req, res) => {
  try {
    const blogData = await Blog.findById(req.params.id);
    if (blogData.coverImage && fs.existsSync(blogData.coverImage)) {
      fs.unlinkSync(blogData.coverImage);
    }
    await Blog.findByIdAndDelete(req.params.id);
    return res.redirect("/blog/viewblog");
  } catch (error) {
      console.log(error);
  return res.redirect("/blog/viewblog");
  }
};
exports.singleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    console.log(blog); 
    return res.render("blog/singleblog", { blog });
  } catch (error) {
    console.log(error);
    return res.redirect("/blog/viewblog");
  }
};