const express = require('express');
const { addAdmin, loginAdmin, getAllAdmin, singleviewAdmin, updateAdmin, deleteAdmin, myprofile, changePassword, addManager, deleteManager, editManager, viewAllManager, viewAllEmployee } = require('../controller/admin.controller');
const uploadImage = require('../middlware/uploadImage');
const {adminToken} = require('../middlware/verifyToken');


const routes = express.Router();

routes.post('/add-admin', uploadImage.single('profileImage'), addAdmin)
routes.post('/login-admin', loginAdmin)
routes.get('/', adminToken, getAllAdmin)
routes.get('/singleview-admin/:id', adminToken, singleviewAdmin)
routes.put('/update-admin/:id', adminToken, uploadImage.single('profileImage'), updateAdmin)
routes.delete('/delete-admin/:id', adminToken, uploadImage.single('profileImage'), deleteAdmin)
routes.get('/my-profile', adminToken, myprofile)
routes.post('/change-password', adminToken, changePassword)

routes.post('/add-manager', adminToken, uploadImage.single('mprofileImage'), addManager)
routes.get('/view-all-manager', adminToken, viewAllManager)
routes.delete('/delete-manager/:id', adminToken, deleteManager)
routes.put('/edit-manager/:id', adminToken, uploadImage.single('mprofileImage'), editManager)

routes.get('/view-all-employee',adminToken,viewAllEmployee)

module.exports = routes;