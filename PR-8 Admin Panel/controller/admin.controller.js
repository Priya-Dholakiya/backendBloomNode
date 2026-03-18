const Admin = require("../model/admin.model");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

exports.addadminpage = async (req, res) => {
    try {
        return res.render("admin/add-admin");
    }
    catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
}

exports.addadmin = async (req, res) => {
    try {
        let imagepath = "";
        if (req.file) {
            console.log(req.file);
            imagepath = `/uploads/${req.file.filename}`
        }
        let hashpassword = await bcrypt.hash(req.body.Password, 10);
        let admin = await Admin.create({
            ...req.body,
            Password: hashpassword,
            ProfileImage: imagepath
        });
        req.flash("success", "admin added successfully");
        return res.redirect("/admin/add-admin");
    }
    catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
}

exports.viewadminpage = async (req, res) => {
    try {
        let admin = await Admin.find();
        return res.render("admin/view-admin", { admin });
    }
    catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
}

exports.deleteadmin = async (req, res) => {
    try {
        let id = req.params.id;
        let admin = await Admin.findById(id);
        if (!admin) {
            console.log("admin not found");
        }
        let filepath = "";
        if (admin.ProfileImage != "") {
            filepath = path.join(__dirname, "..", admin.ProfileImage);
            try {
                await fs.unlinkSync(filepath);
            }
            catch (err) {
                console.log("fille is missing");
            }
        }
        await Admin.findByIdAndDelete(id);
        req.flash("success", "admin deleted successfully");
        return res.redirect("/admin/view-admin");
    }
    catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
}

exports.editadmin = async (req, res) => {
    try {
        let id = req.params.id;
        let admin = await Admin.findById(id);
        return res.render("admin/edit-admin", { admin });
    }
    catch (err) {
        console.log(err)
        return res.redirect("/dashboard")
    }
}

exports.updateadmin = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id);
        if (!admin) {
            console.log("admin not found");
        }
        let filepath = "";
        if (req.file) {
            if (admin.ProfileImage != "") {
                filepath = path.join(__dirname, "..", admin.ProfileImage);
                try {
                    await fs.unlinkSync(filepath);
                }
                catch (err) {
                    console.log("fille is missing");
                }
            }
            filepath = `/uploads/${req.file.filename}`;
        }
        else {
            filepath = admin.ProfileImage;
        }
        admin = await Admin.findByIdAndUpdate(admin._id, { ...req.body, ProfileImage: filepath }, { new: true });
        if (admin) {
            req.flash("success", "admin updated successfully");
            return res.redirect("/admin/view-admin");
        }
    }
    catch (err) {
        console.log(err)
        return res.redirect("/dashboard");
    }
}

