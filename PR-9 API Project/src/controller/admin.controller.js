const { StatusCodes } = require('http-status-codes')
const Admin = require('../model/admin.model')
const Manager = require('../model/manager.model')
const Employee = require('../model/employee.model')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')
const sendEmail = require('../middlware/sendMail.config')

exports.addAdmin = async (req, res) => {
    try {
        let alreadyAdmin = await Admin.findOne({ email: req.body.email, isDelete: false })
        if (alreadyAdmin) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Already Exist Admin " })
        }
        let imagepath = "";
        if (req.file) {
            imagepath = `/uploads/${req.file.filename}`
        }

        let hashpassword = await bcrypt.hash(req.body.password, 10);

        let admin = await Admin.create({
            ...req.body,
            password: hashpassword,
            profileImage: imagepath
        })

        return res.status(StatusCodes.CREATED).json({ message: "Admin Created Sucessfully !!", admin })

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", err: error.message })
    }
}

exports.loginAdmin = async (req, res) => {
    try {
        let admin = await Admin.findOne({ email: req.body.email, isDelete: false })
        if (!admin) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Admin Not Found " })
        }
        let matchpassword = await bcrypt.compare(req.body.password, admin.password)
        if (!matchpassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: " Email and password Not Match !!", err: error.message })
        }

        let payload = {
            adminId: admin._id
        }

        let adminToken = JWT.sign(payload, 'role-admin')

        return res.status(StatusCodes.OK).json({ message: "Login Sucessfully !!", admin, adminToken })

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", err: error.message })
    }
}

exports.getAllAdmin = async (req, res) => {
    try {
        let admin = await Admin.find({ isDelete: false });

        return res.status(StatusCodes.OK).json({ message: "All Admin Record", admin })

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.NOT_FOUND).json({ message: "admin not found", err: error.message })
    }
}

exports.singleviewAdmin = async (req, res) => {
    try {
        let id = req.params.id;
        let admin = await Admin.findById(id);

        if (!admin || admin.isDelete === true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Not a Found Admin" })
        }

        return res.status(StatusCodes.OK).json({ message: "Single Admin Record", admin })


    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "internal Server Error", err: error.message })
    }
}

exports.updateAdmin = async (req, res) => {
    try {
        let id = req.params.id;
        let admin = await Admin.findById(id);

        if (!admin || admin.isDelete === true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Admin Not found " })
        }

        let filepath;
        if (req.file) {
            if (admin.profileImage != "") {
                filepath = path.join(__dirname, "..", admin.profileImage)

                try {
                    await fs.unlinkSync(filepath)

                } catch (error) {
                    console.log('file missing');

                }
            }
            filepath = `/uploads/${req.file.filename}`

        } else {

            filepath = admin.profileImage;
        }

        let updatedAdmin = await Admin.findOneAndUpdate(admin._id, {
            ...req.body,
            profileImage: filepath
        }, { new: true })

        return res.status(StatusCodes.OK).json({ message: "Updated Admin Profile", updatedAdmin })

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", err: error.message })
    }
}

exports.deleteAdmin = async (req, res) => {
    try {
        let id = req.params.id;
        let admin = await Admin.findById(id);

        if (!admin || admin.isDelete === true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Admin Not Found" })
        }

        // let filepath;
        // if (req.file) {
        //     if (admin.profileImage != "") {
        //         filepath = path.join(__dirname, "..", admin.profileImage)
        //         try {
        //             await fs.unlinkSync(filepath)

        //         } catch (error) {
        //             console.log('file missing');

        //         }
        //     }
        // }

        let deletedAdmin = await Admin.findByIdAndUpdate(admin._id, { isDelete: true }, { new: true });

        return res.status(StatusCodes.OK).json({ message: "Admin Deleted Succesfully ", deletedAdmin })

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", err: error.message })
    }
}

exports.myprofile = async (req, res) => {
    try {
        let admin = req.user;
        if (!admin || admin.isDelete === true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'data Not Found ' })
        }
        return res.status(StatusCodes.OK).json({ message: "My Profile Data", admin })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", err: error.message })
    }
}

exports.changePassword = async (req, res) => {
    try {

        let { oldpassword, newpassword, confirmpassword } = req.body;
        let admin = req.user;
        if (!admin || admin.isDelete === true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Data Not Found' })
        }

        let matchpass = await bcrypt.compare(oldpassword, admin.password)
        if (!matchpass) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: " password not match !!" })
        }

        if (newpassword == confirmpassword) {
            let hashpassword = await bcrypt.hash(newpassword, 10)
            await Admin.findByIdAndUpdate(admin._id, {
                password: hashpassword
            }, { new: true })
            return res.status(StatusCodes.OK).json({ message: 'password changed successfully !!' })
        }
        else {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "New and confirm password noty match !!" })
        }


    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", err: error.message })
    }
}

exports.addManager = async (req, res) => {

    try {
        let admin = req.user;
        let { name, email, password } = req.body;
        let alreadyManager = await Manager.findOne({ email: req.body.email, isDelete: false })
        if (alreadyManager) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Already Exist Manager " })
        }
        let imagepath = "";
        if (req.file) {
            imagepath = `/uploads/${req.file.filename}`
        }

        let hashpassword = await bcrypt.hash(req.body.password, 10);

        let manager = await Manager.create({
            ...req.body,
            password: hashpassword,
            mprofileImage: imagepath
        })

        let message = {
            from: `ayushidaslani75@gmail.com`,
            to: email,
            subject: 'Your Manager Account Details',
            html: `
            <h3>Hello ${name}</h3>
                <p>Your manager account has been created by admin.</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Password:</b> ${password}</p>
                <p>Please login and change your password after first login.</p>
            `
        }
        sendEmail(message);

        return res.status(StatusCodes.CREATED).json({ message: "Manager Created Sucessfully !!", manager })

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", err: error.message })
    }


}

exports.viewAllManager = async (req, res) => {
    try {
        let manager = await Manager.find({ isDelete: false });

        if (!manager) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Manager Not Found ' });
        }

        return res.status(StatusCodes.OK).json({ message: 'All Manager Record ', manager })

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', err: error.message })
    }
}

exports.deleteManager = async (req, res) => {
    try {
        let id = req.params.id;
        let manager = await Manager.findById(id);

        if (!manager || manager.isDelete === true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "manager Not Found" })
        }

        // let filepath;
        // if (req.file) {
        //     if (manager.mprofileImage != "") {
        //         filepath = path.join(__dirname, "..", manager.mprofileImage)
        //         try {
        //             await fs.unlinkSync(filepath)

        //         } catch (error) {
        //             console.log('file missing');

        //         }
        //     }
        // }

        await Manager.findByIdAndUpdate(manager._id, { isDelete: true }, { new: true });

        return res.status(StatusCodes.OK).json({ message: "Manager Deleted Succesfully ", manager })

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", err: error.message })
    }
}

exports.editManager = async (req, res) => {
    try {
        let id = req.params.id;
        let manager = await Manager.findById(id);

        if (!manager || manager.isDelete === true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "manager Not found " })
        }

        let filepath;
        if (req.file) {
            if (manager.mprofileImage != "") {
                filepath = path.join(__dirname, "..", manager.mprofileImage)

                try {
                    await fs.unlinkSync(filepath)

                } catch (error) {
                    console.log('file missing');

                }
            }
            filepath = `/uploads/${req.file.filename}`

        } else {

            filepath = manager.mprofileImage;
        }

        let editmanager = await Manager.findOneAndUpdate(manager._id, {
            ...req.body,
            mprofileImage: filepath
        }, { new: true })

        return res.status(StatusCodes.OK).json({ message: "Updated Manager Profile", editmanager })


    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', err: error.message })
    }
}

exports.viewAllEmployee = async (req, res) => {
    try {
        let employee = await Employee.find({ isDelete: false });

        if (!employee || isDelete === true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Employee Not Found ' });
        }

        return res.status(StatusCodes.OK).json({ message: 'All Manager Record ', employee })

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', err: error.message })
    }
}




//admin token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjk4ZTA5YTdlMmM1YTMwY2JjY2IwOWVjIiwiaWF0IjoxNzcwOTE2MzE3fQ.b37fYgGSWonhf8qADG33_OiWKJ1sgp_UvJzvtJeWWgA

// john =  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjk4ZTBhZGYxYTYwODk2ODRhZjQwNzNiIiwiaWF0IjoxNzcwOTE3MTI1fQ.b0Bi3cPYRSvq8Tk_b67PPYjf6MwHk31BX1RdA88Cix8