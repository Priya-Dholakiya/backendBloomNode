const express = require('express');
const { teamLeadToken } = require('../middleware/verifyToken');
const uploadImage = require('../middleware/uploadImage');
const { loginTeamLead, myProfile, updateTeamLead, addStaffMember, getAllStaffMembers, updateStaffMember, deleteStaffMember } = require('../controller/teamlead.controller');

const routes = express.Router();

routes.post("/login", loginTeamLead);
routes.get("/profile", teamLeadToken, myProfile);
routes.put("/profile/:id", teamLeadToken, uploadImage.single('teamLeadImage'), updateTeamLead);

routes.post("/staff", teamLeadToken, uploadImage.single('staffMemberImage'), addStaffMember);
routes.get("/staff", teamLeadToken, getAllStaffMembers);
routes.put("/staff/:id", teamLeadToken, uploadImage.single('staffMemberImage'), updateStaffMember);
routes.delete("/staff/:id", teamLeadToken, deleteStaffMember);

module.exports = routes;
