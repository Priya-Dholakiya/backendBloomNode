const Admin = require('../model/admin.model');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

exports.registerAdmin = async (req, res) => {
    try {
        let admin = await Admin.findOne({ email: req.body.email });

        if (admin) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Admin Already Exist' });
        }

        let imagePath = req.file ? `/uploads/${req.file.filename}` : "";
        let hashpass = await bcrypt.hash(req.body.password, 10);

        let newAdmin = await Admin.create({
            ...req.body,
            adminImage: imagePath,
            password: hashpass
        })

        return res.status(StatusCodes.CREATED).json({ message: 'Register Success', newAdmin });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
}

exports.loginAdmin = async (req, res) => {
    try {
        let admin = await Admin.findOne({ email: req.body.email });

        if (!admin) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Admin Not Found' });
        }

        let matchpassword = await bcrypt.compare(req.body.password, admin.password);
        if (!matchpassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: " Email and password Not Match !!" });
        }

        let payload = {
            adminId: admin._id
        }

        let adminToken = JWT.sign(payload, 'web-app')

        return res.status(StatusCodes.OK).json({ message: 'Login Admin Success', admin, adminToken });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
}