const express = require('express');
const { loginManager, myprofile, updateManager, addEmployee, viewAllEmployee, deleteEmployee, updateEmployee } = require('../controller/manager.controller');
const { managerToken } = require('../middlware/verifyToken');
const uploadImage = require('../middlware/uploadImage');
const routes = express.Router();

routes.post('/login-manager', loginManager)
routes.get('/my-profile', managerToken, myprofile)
routes.put('/update-manager/:id', managerToken, uploadImage.single('mprofileImage'), updateManager)

routes.post('/add-employee', managerToken, uploadImage.single('eprofileImage'), addEmployee)
routes.get('/view-all-employee',managerToken,viewAllEmployee)
routes.delete('/delete-employee/:id',managerToken,deleteEmployee)
routes.put('/update-employee/:id',managerToken,uploadImage.single('eprofileImage'),updateEmployee)

module.exports = routes;