const { StatusCodes } = require('http-status-codes');
const Manager = require('../model/manager.model');
const Employee = require('../model/employee.model')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const path = require('path')
const fs = require('fs');
const sendEmail = require('../middlware/sendMail.config');

exports.loginManager = async (req, res) => {
    try {
        let manager = await Manager.findOne({ email: req.body.email, isDelete: false })

        if (!manager) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Manager Not Found !!' })
        }

        let matchpassword = await bcrypt.compare(req.body.password, manager.password)
        if (!matchpassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: " Email and password Not Match !!", err: error.message })
        }

        let payload = {
            managerId: manager._id
        }
        let managerToken = JWT.sign(payload, 'role-manager')

        return res.status(StatusCodes.CREATED).json({ message: 'Manager Login successfully !!', manager, managerToken })


    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', err: error.message })

    }
}

exports.myprofile = async (req, res) => {
    try {
        let manager = req.user;
        if (!manager || manager === true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Manager not found ' })
        }

        return res.status(StatusCodes.OK).json({ message: "Manager profile record", manager })

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', err: error.message })
    }
}

exports.updateManager = async (req, res) => {
    try {
        let id = req.params.id;
        let manager = await Manager.findById(id);

        if (!manager || manager.isDelete === true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Manager Not Found " })
        }
        let filepath;
        if (req.file) {
            if (manager.mprofileImage != '') {
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
        let updatemanager = await Manager.findOneAndUpdate(manager._id, {
            ...req.body,
            mprofileImage: filepath
        }, { new: true })

        return res.status(StatusCodes.OK).json({ message: "Updated Manager Profile", updatemanager })

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", err: error.message })

    }
}

exports.addEmployee = async (req, res) => {
    try {
        let manager = req.user;
        let { name, email, password } = req.body;
        let alreadyEmployee = await Employee.findOne({ email: req.body.email, isDelete: false })
        if (alreadyEmployee) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Already Exist employee " })
        }
        let imagepath = "";
        if (req.file) {
            imagepath = `/uploads/${req.file.filename}`
        }

        let hashpassword = await bcrypt.hash(req.body.password, 10);

        let employee = await Employee.create({
            ...req.body,
            password: hashpassword,
            eprofileImage: imagepath
        })

        let message = {
            from: `ayushidaslani75@gmail.com`,
            to: email,
            subject: 'Your Employee Account Details',
            html: `
            <h3>Hello ${name}</h3>
                <p>Your Employee account has been created by Maanger.</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Password:</b> ${password}</p>
                <p>Please login and change your password after first login.</p>
            `
        }
        sendEmail(message);

        return res.status(StatusCodes.CREATED).json({ message: "Employee Created Sucessfully !!", employee })

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", err: error.message })
    }
}

exports.viewAllEmployee = async (req, res) => {
    try {
        let employee = await Employee.find({ isDelete: false });

        return res.status(StatusCodes.OK).json({ message: "All Employee", employee })

    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", err: error.message })
    }
}

exports.deleteEmployee = async (req, res) => {
    try {
        let id = req.params.id;
        let employee = await Employee.findById(id);

        if (!employee || employee.isDelete === true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "employee Not Found" })
        }

        // let filepath;
        // if (req.file) {
        //     if (employee.eprofileImage != "") {
        //         filepath = path.join(__dirname, "..", employee.mprofileImage)
        //         try {
        //             await fs.unlinkSync(filepath)

        //         } catch (error) {
        //             console.log('file missing');

        //         }
        //     }
        // }

        await Employee.findByIdAndUpdate(employee._id, { isDelete: true }, { new: true });

        return res.status(StatusCodes.OK).json({ message: "Employee Deleted Succesfully ", employee })

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error ", err: error.message })

    }
}

exports.updateEmployee = async (req, res) => {
    try {
        let id = req.params.id;
        let employee = await Employee.findById(id);

        if (!employee || employee.isDelete === true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "employee Not found " })
        }

        let filepath;
        if (req.file) {
            if (employee.eprofileImage != "") {
                filepath = path.join(__dirname, "..", employee.eprofileImage)

                try {
                    await fs.unlinkSync(filepath)

                } catch (error) {
                    console.log('file missing');

                }
            }
            filepath = `/uploads/${req.file.filename}`

        } else {

            filepath = employee.eprofileImage;
        }

        let editemployee = await Employee.findOneAndUpdate(employee._id, {
            ...req.body,
            eprofileImage: filepath
        }, { new: true })

        return res.status(StatusCodes.OK).json({ message: "Updated employee Profile", editemployee })


    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', err: error.message })
    }
}


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYW5hZ2VySWQiOiI2OThlMGUzMWZhYWZiMzczMGI0YjY0ZGIiLCJpYXQiOjE3NzA5MTgwMDR9.IwdGs9VDA-Hm0QVjzht6npP_EQqSxuCp438HrGbJNx0