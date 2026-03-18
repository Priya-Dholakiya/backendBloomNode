const express = require("express");
const {
  addsubcategorypage,
  addsubcategory,
  viewsubcategory,
  deletesubcategory,
  editsubcategory,
  updatesubcategory,
} = require("../controller/subcategory.controller");
const routes = express.Router();

routes.get("/add-subcategory", addsubcategorypage);
const uploadimage = require("../middleware/image.uploads");
routes.post(
  "/add-subcategory",
  uploadimage.single("SubcategoryImage"),
  addsubcategory,
);
routes.get("/view-subcategory", viewsubcategory);
routes.get("/delete-category/:id", deletesubcategory);
routes.get("/edit-category/:id", editsubcategory);
routes.post("/update-subcategory/:id", updatesubcategory);

module.exports = routes;
