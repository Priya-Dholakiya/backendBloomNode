const express = require("express");
const {
  addcategorypage,
  addcategory,
  viewcategory,
  deletecategory,
  editcategory,
  updatecategory,
} = require("../controller/category.controller");
const uploadsimage = require("../middleware/image.uploads");

const routes = express.Router();

routes.get("/add-category", addcategorypage);
routes.post("/add-category", uploadsimage.single("CategoryImage"), addcategory);
routes.get("/view-category", viewcategory);
routes.get("/delete-category/:id", deletecategory);
routes.get("/edit-category/:id", editcategory);
routes.post(
  "/update-category/:id",
  uploadsimage.single("CategoryImage"),
  updatecategory,
);

module.exports = routes;
