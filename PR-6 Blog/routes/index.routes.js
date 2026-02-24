const express = require("express");
const { home, dashboard } = require("../controller/index.controller");
const routes = express.Router();

routes.get("/", home);
routes.get("/dashboard", dashboard);

routes.use("/blog", require("./blog.routes"));

module.exports = routes;
