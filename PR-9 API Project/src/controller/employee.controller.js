const { StatusCodes } = require('http-status-codes')
const Employee = require('../model/employee.model')
const bcrypt = require('bcrypt')
const Jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')

exports.loginEmployee = async (req, res) => {
    try {
        let employee = await Employee.findOne({ email: req.body.email, isDelete: false });

        if (!employee) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Employee Not found !!" })
        }

        let matchpass = await bcrypt.compare(req.body.password, employee.password)
        if (!matchpass) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Email and Password are not match !!" })
        }

        let payload = {
            employeeId: employee._id
        }

        let employeeToken = Jwt.sign(payload, 'role-employee')

        return res.status(StatusCodes.CREATED).json({ message: "Employee Login successfully !!", employeeToken, employee })



    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', err: error.message })
    }
}

exports.myprofile = async (req, res) => {
    try {
        let employee = req.user;

        if (!employee || employee.isDelete === true) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Data Not Found " })
        }

        if (!employee) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Employee  Not Found  !!" })

        }
        return res.status(StatusCodes.OK).json({ message: "Employee Profile  !!", employee })



    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', err: error.message })
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

        let editemployee = await Employee.findByIdAndUpdate(employee._id, {
            ...req.body,
            eprofileImage: filepath
        }, { new: true })

        return res.status(StatusCodes.OK).json({ message: "Updated employee Profile", editemployee })


    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "internal server error", err: error.message })
    }
}


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiNjk4ZTE0NWQwOTRkM2UwMzlhZDE5OTA0IiwiaWF0IjoxNzcwOTE5MzQ1fQ.2eV4w0OkpzgxiBvwgpb498BcTRPPdEFKMZSJm0oQVAs