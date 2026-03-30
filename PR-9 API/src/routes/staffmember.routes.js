const express = require('express');
const { staffMemberToken } = require('../middleware/verifyToken');
const uploadImage = require('../middleware/uploadImage');
const { loginStaffMember, myProfile, updateStaffMember } = require('../controller/staffmember.controller');

const routes = express.Router();

routes.post("/login", loginStaffMember);
routes.get('/profile', staffMemberToken, myProfile);
routes.put('/profile/:id', staffMemberToken, uploadImage.single('staffMemberImage'), updateStaffMember);

module.exports = routes;
