const express = require('express');

const routes = express.Router();

routes.use("/superuser", require("./superuser.routes"));
routes.use("/teamlead", require("./teamlead.routes"));
routes.use("/staffmember", require("./staffmember.routes"));

module.exports = routes;
