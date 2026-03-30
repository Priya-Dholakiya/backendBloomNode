const express = require('express');
const uploadImage = require('../middleware/uploadImage');
const { superUserToken } = require('../middleware/verifyToken');
const { registerSuperUser, loginSuperUser, getAllSuperUsers, getSuperUser, deleteSuperUser, updateSuperUser, myProfile, changePassword, addTeamLead, getAllTeamLeads, updateTeamLead, deleteTeamLead, getAllStaffMembers } = require('../controller/superuser.controller');

const routes = express.Router();

routes.post("/register", uploadImage.single('superUserImage'), registerSuperUser);
routes.post("/login", loginSuperUser);
routes.get("/", superUserToken, getAllSuperUsers);
routes.get("/profile/:id", superUserToken, myProfile);
routes.get("/:id", superUserToken, getSuperUser);
routes.delete("/:id", superUserToken, uploadImage.single('superUserImage'), deleteSuperUser);
routes.put("/:id", superUserToken, uploadImage.single('superUserImage'), updateSuperUser);
routes.post("/change-password", superUserToken, changePassword);

// TeamLead routes
routes.post('/teamlead', superUserToken, uploadImage.single('teamLeadImage'), addTeamLead);
routes.get('/teamleads', superUserToken, getAllTeamLeads);
routes.put('/teamlead/:id', superUserToken, uploadImage.single('teamLeadImage'), updateTeamLead);
routes.delete('/teamlead/:id', superUserToken, deleteTeamLead);

// Staff view
routes.get('/staff', superUserToken, getAllStaffMembers);

module.exports = routes;
