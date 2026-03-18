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
router.use(
  "/category",
  passport.checkAuthentication,
  require("./category.routes"),
);
router.use(
  "/subcategory",
  passport.checkAuthentication,
  require("./subcategory.routes"),
);
router.use(
  "/extrasubcategory",
  passport.checkAuthentication,
  require("./extrasubcategory.routes"),
);
router.use(
  "/product",
  passport.checkAuthentication,
  require("./product.routes"),
);
router.use("/cart", passport.checkAuthentication, require("./cart.routes"));

module.exports = router;
