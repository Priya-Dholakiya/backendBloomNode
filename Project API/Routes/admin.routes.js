const express = require('express');
const routes = express.Router();

const root = require('../Controller/admin.controller')

// Admin Routes
routes.post('/', root.registerAdmin);
routes.get('/', root.fetchAllAdmins);
routes.get('/:_id', root.fetchAdmin);
routes.get('/search/:searchquery', root.findSpecificAdmin);
routes.get('/search', root.findAdmins);

module.exports = routes;