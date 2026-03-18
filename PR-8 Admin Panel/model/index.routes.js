const express = require('express');
const { webpage, singleProduct, } = require('../controller/index.controller');
const routes = express.Router();

routes.get("/", webpage);
routes.get("/single-product/:id", singleProduct);




module.exports = routes;