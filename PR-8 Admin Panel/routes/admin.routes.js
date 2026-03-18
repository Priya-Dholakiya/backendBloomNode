const express = require("express");
const { addadminpage, addadmin, viewadminpage, deleteadmin, editadmin, updateadmin } = require("../controller/admin.controller");
const uploadsimage = require("../middleware/image.uploads");

const routes = express.Router();

routes.get("/add-admin", addadminpage);
routes.post("/add-admin", uploadsimage.single("ProfileImage"), addadmin);
routes.get("/view-admin", viewadminpage);
routes.get("/delete-admin/:id", deleteadmin);
routes.get("/edit-admin/:id", editadmin);
routes.post("/update-admin/:id", uploadsimage.single("ProfileImage"),updateadmin);




module.exports = routes;