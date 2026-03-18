const express = require('express');
const { getdashboard, loginpage, adminloginpage, logout, changepasswordpage, changepassword, myprofile, profile, forgotpassword, sendotp, verifyotppage, verifyotp, updatepasswordpage, updatepassword } = require('../controller/auth.controller');
const passport = require('passport');



const routers = express.Router();
routers.get("/", loginpage);

routers.post("/login", passport.authenticate('local', { failureRedirect: "/" }), adminloginpage);
routers.get("/logout", logout);
routers.get("/dashboard", passport.checkAuthentication, getdashboard);
routers.get("/change-password", changepasswordpage);
routers.post("/change-password", changepassword);
routers.get("/profile", passport.checkAuthentication, myprofile);

routers.get("/forgot-password", forgotpassword);
routers.post("/send-otp", sendotp);
routers.get("/verify-otp", verifyotppage);
routers.post("/verify-otp", verifyotp);
routers.get("/update-password", updatepasswordpage);
routers.post("/upadte-password", updatepassword);


routers.use("/admin", passport.checkAuthentication, require("../routes/admin.routes"));
routers.use("/category", passport.checkAuthentication, require("../routes/category.routes"));
routers.use("/subcategory", passport.checkAuthentication, require("../routes/subcategory.routes"));
routers.use("/extrasubcategory", passport.checkAuthentication, require("../routes/extrasubcategory.routes"));
routers.use("/product", passport.checkAuthentication, require("../routes/product.routes"));
routers.use("/webpage", require("../routes/index.routes"));
routers.use("/cart", require("../routes/cart.routes"));

module.exports = routers;   