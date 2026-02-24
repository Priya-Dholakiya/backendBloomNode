const blog = require("../model/Blog.model");
exports.home = async (req, res) => {
  return res.redirect("/dashboard");
};
exports.dashboard = async (req, res) => {
  try {
    return res.render("dashboard");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};