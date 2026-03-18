const express = require("express");
const uploadimage = require("../middleware/image.uploads");
const {
  addproductpage,
  addproduct,
  viewproduct,
  deleteproduct,
  editproductpage,
  updateproduct,
  getsubcategory,
  getextrasubcategory,
} = require("../controller/product.controller");

const routes = express.Router();

routes.get("/subcategory/:id", getsubcategory);
routes.get("/extrasubcategory/:id", getextrasubcategory);
routes.get("/add-product", addproductpage);
routes.post("/add-product", uploadimage.single("ProductImage"), addproduct);
routes.get("/view-product", viewproduct);
routes.get("/delete-product/:id", deleteproduct);
routes.get("/edit-product/:id", editproductpage);
routes.post(
  "/update-product/:id",
  uploadimage.single("ProductImage"),
  updateproduct,
);

module.exports = routes;
