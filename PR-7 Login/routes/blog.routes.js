const express = require("express");
const {addblogPage,addblog, viewAllblogs, editblog,updateblog, deleteblog,singleBlog} = require("../controllers/blog.controller");

const uploadImage = require("../middleware/uploadImage");
const routes = express.Router();

routes.get("/addblog", addblogPage);
routes.post("/addblog", uploadImage.single("coverImage"), addblog);
routes.get("/viewblog", viewAllblogs);
routes.get("/editblog/:id", editblog);
routes.post("/updateblog/:id", uploadImage.single("coverImage"), updateblog);
routes.get("/deleteblog/:id", deleteblog);

routes.get("/single/:id", singleBlog);

module.exports = routes;
