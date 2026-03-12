const express = require("express");
const {
  getdashboard,
  loginpage,
  adminloginpage,
  adminlogout,
  myprofile,
  changepassword,
  changepasswordpage,
} = require("../controller/auth.controller");
const passport = require("passport");

const router = express.Router();
router.get("/", loginpage);
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/", failureFlash: true }),
  adminloginpage,
);
router.get("/dashboard", passport.checkAuthentication, getdashboard);
router.get("/logout", adminlogout);
router.get("/profile", passport.checkAuthentication, myprofile);
router.get("/change-password", changepasswordpage);
router.post("/change-password", changepassword);

router.use("/admin", passport.checkAuthentication, require("./admin.routes"));
router.use("/blogs", passport.checkAuthentication, require("./blog.routes"));

module.exports = router;
