const Admin = require("../model/admin.model");
const bcrypt = require("bcrypt");
const session = require("express-session");

exports.loginpage = async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            return res.redirect("/dashboard");
        }
        else {
            return res.render("loginpage");
        }
    }
    catch (err) {
        console.log(err);
    }
}

exports.getdashboard = async (req, res) => {
    try {
        return res.render("dashboard");
    }
    catch (err) {
        console.log(err);
    }
}

exports.adminloginpage = async (req, res) => {
    try {
        req.flash("success", "login successfully");
        return res.redirect("/dashboard")
    }
    catch (err) {
        req.flash("error","email or password not found");
        return res.redirect("/");
    }
}


exports.adminlogout = (req, res) => {
    req.flash("success", "Logout successfully");
    req.session.destroy(() => {
        res.redirect("/");
    });
};

exports.myprofile = ((req, res) => {
    try {
        return res.render("myprofile");
    }
    catch (err) {
        console.log(err);
    }
})

exports.changepasswordpage = ((req, res) => {
    try {
        let user = req.user;
        console.log(user);
        return res.render("changepassword", { user });
    }
    catch (err) {
        console.log(err);
    }
})

exports.changepassword = async (req, res) => {
    try {
        const { oldpass, newpass, cpassword } = req.body;
        let user = req.user;
        let matchpass = await bcrypt.compare(oldpass, user.Password);
        if (!matchpass) {
            req.flash("error", "old password is incorrect");
            return res.redirect("/change-password");
        }
        if (newpass == cpassword) {
            let hashpassword = await bcrypt.hash(newpass, 10);
            await Admin.findByIdAndUpdate(user._id, { Password: hashpassword }, { new: true });
            req.flash("success", "password changed successfully");
            return res.redirect("/dashboard");
        }
        else {
            req.flash("error", "new password and confirm password is not same");
            return res.redirect("/change-password");
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect("/");
    }
}