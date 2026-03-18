const express = require("express");
const {
  addextrasubcategorypage,
  addextrasubcategory,
  viewextrasubcategorypage,
  deletesubcategory,
  editsubcategory,
  updatesubcategory,
  getsubcategory,
} = require("../controller/extrasubcategory.controller");

const routes = express.Router();

routes.get("/subcategory/:id", getsubcategory);
routes.get("/add-extrasubcategory", addextrasubcategorypage);
const uploadimage = require("../middleware/image.uploads");
routes.post(
  "/add-extrasubcategory",
  uploadimage.single("ExtrasubcategoryImage"),
  addextrasubcategory,
);
routes.get("/view-extrasubcategory", viewextrasubcategorypage);
routes.get("/delete-extrasubcategory/:id", deletesubcategory);
routes.get("/edit-extrasubcategory/:id", editsubcategory);
routes.post("/update-extrasubcategory/:id", updatesubcategory);
exports = module.exports = routes;
