const express = require('express');
const routes = express.Router();

const root = require('../Controller/manager.controller')

// MANAGER ROUTES
routes.post('/', root.registerManager);
routes.get('/', root.fetchAllManagers);
routes.get('/:_id', root.fetchManager);
routes.put('/:_id', root.updateManager);
routes.delete('/:_id', root.deleteManager);
routes.get('/search/:searchquery', root.findSpecificManager);
routes.get('/search', root.findManagers);


module.exports = routes;