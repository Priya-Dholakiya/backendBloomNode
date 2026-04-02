const express = require('express');
const routes = express.Router();
const root = require('../Controller/index.controller')

routes.get('/', root.status);
routes.get('/health', root.health);
routes.get('/info', root.info);

routes.use('/admin', require('./admin.routes'));
routes.use('/manager', require('./manager.routes'));
routes.use('/employee', require('./employee.routes'));


module.exports = routes;