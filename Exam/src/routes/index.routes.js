const express = require('express');
const { registerAdmin, loginAdmin } = require('../controller/auth.controller');
const uploadImage = require('../middleware/uploadImage');

const routes = express.Router();

routes.post("/register", uploadImage.single('adminImage'), registerAdmin);
routes.post("/login", loginAdmin);

routes.use("/admin", require('./recipe.routes'));
routes.use("/commit", require('./commit.routes'));

module.exports = routes;