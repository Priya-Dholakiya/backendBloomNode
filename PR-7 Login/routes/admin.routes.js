const express = require('express');
const routes = express.Router();
const passport = require('passport');

const {addAdminPage,addAdmin,viewAllAdmins,editAdmin,updateAdmin,deleteAdmin} = require('../controllers/admin.controller');    
const uploadImage = require('../middleware/uploadImage');

routes.get('/addadmin', addAdminPage);
routes.post('/addadmin',uploadImage.single('profileImage'),addAdmin);
routes.get('/viewadmin', viewAllAdmins);

routes.get("/editAdmin/:id", editAdmin);
routes.post("/updateAdmin/:id",uploadImage.single("profileImage"),updateAdmin);
routes.get('/deleteadmin/:id', deleteAdmin);


module.exports = routes;
