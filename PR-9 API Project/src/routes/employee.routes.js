const express = require('express');
const { loginEmployee, myprofile, updateEmployee } = require('../controller/employee.controller');
const { employeeToken } = require('../middlware/verifyToken');
const uploadImage = require('../middlware/uploadImage');
const routes = express.Router();

routes.post('/login-employee', loginEmployee)
routes.get('/my-profile', employeeToken, myprofile)
routes.put('/update-employee/:id', employeeToken, uploadImage.single('eprofileImage'), updateEmployee)

module.exports = routes;