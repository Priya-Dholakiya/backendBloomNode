const Admin = require("../model/admin.model");
const bcrypt = require("bcrypt");

exports.viewAllAdmins = async (req, res) => {
    try {
        let admins = await Admin.find();
        return res.render("admin/viewAdmin", { admins });
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}
exports.addAdminPage = async (req, res) => {
    try {
        return res.render("admin/addAdmin");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.addAdmin = async (req, res) => {
    try {
        let imagePath = req.file ? `/uploads/${req.file.filename}` : "";
        let hashPassword = await bcrypt.hash(req.body.password, 10);
        let admin = await Admin.create({
            ...req.body,
            password: hashPassword,
            profileImage: imagePath
        });
        req.flash('success','Admin Added Success');
        return res.redirect("/admin/add-admin");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.editAdmin = async (req, res) => {
    try {
        if (req.cookies && req.cookies.user && req.cookies.user._id) {

            const user = await Admin.findById(req.cookies.user._id);
            const adminData = await Admin.findById(req.params.id);

            return res.render("admin/editAdmin", { adminData, user });

        } else {
            return res.redirect("/");
        }

    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);

        let imagePath = admin.profileImage;

        if (req.file) {
            if (admin.profileImage) {
                try {
                    fs.unlinkSync(admin.profileImage);
                } catch (err) {
                    console.log("Old image not found, skipping delete");
                }
            }

            imagePath = "uploads/" + req.file.filename;
        }

        await Admin.findByIdAndUpdate(req.params.id, {
            ...req.body,
            profileImage: imagePath
        });

        return res.redirect("/admin/viewadmin");
    } catch (error) {
        console.log(error);
        return res.redirect("/admin/viewadmin");
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id);
        if (admin.profileImage) {
            if (fs.existsSync(admin.profileImage)) {
                fs.unlinkSync(admin.profileImage);
            }
        }
        await Admin.findByIdAndDelete(req.params.id);

        return res.redirect("/admin/viewadmin");
    } catch (error) {
        console.log(error);
        res.redirect("/admin/viewadmin");
    }
};