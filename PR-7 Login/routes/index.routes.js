const express = require('express');
const {
  login,
  home,
  dashboard,
  myProfile,
  changePasswordPage,
  logOutAdmin,
  changePassword,
  forgotPasswordPage,
  verifyOtpPage,
  sendOtp,
  verifyOtp
} = require('../controllers/index.controller');
const routes = express.Router();
// routes.get("/", dashboard);
const passport = require('passport');


routes.get("/", home);
routes.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/"
  }),
  login
);
routes.get("/dashboard", dashboard);
routes.get("/myProfile",myProfile);
routes.get("/logout",logOutAdmin);
routes.post("/changePassword",changePassword);

routes.use("/admin", require("./admin.routes"));
routes.use("/blog", require("./blog.routes"));

// forgot pass
routes.get("/changePassword", changePasswordPage);

routes.get('/forgotpassword', forgotPasswordPage);
routes.post('/sendotp', sendOtp);
routes.get('/verifyotp', verifyOtpPage);

// zlcq pldx tkra vmbb


routes.post('/verifyotp', verifyOtp);
module.exports = routes;