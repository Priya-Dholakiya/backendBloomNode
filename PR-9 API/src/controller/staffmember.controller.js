const { StatusCodes } = require('http-status-codes');
const StaffMember = require('../model/employee.model');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

exports.loginStaffMember = async (req, res) => {
    try {
        let staffMember = await StaffMember.findOne({ email: req.body.email, isDelete: false });
        if (!staffMember) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'StaffMember not found' });
        }
        let match = await bcrypt.compare(req.body.password, staffMember.password);
        if (!match) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
        }
        let payload = { staffMemberId: staffMember._id };
        let token = JWT.sign(payload, 'staff-role-sm');
        return res.status(StatusCodes.OK).json({ message: 'Login successful', staffMember, token });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Login failed' });
    }
};

exports.myProfile = async (req, res) => {
    try {
        return res.status(StatusCodes.OK).json({ message: 'Profile', profile: req.user });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error' });
    }
};

exports.updateStaffMember = async (req, res) => {
    try {
        let staffMember = await StaffMember.findById(req.params.id);
        if (!staffMember || staffMember.isDelete) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'StaffMember not found' });
        }
        let filepath = staffMember.staffMemberImage;
        if (req.file) {
            if (staffMember.staffMemberImage) {
                fs.unlinkSync(path.join(__dirname, '..', staffMember.staffMemberImage));
            }
            filepath = `/uploads/${req.file.filename}`;
        }
        await StaffMember.findByIdAndUpdate(req.params.id, {
            staffMemberName: req.body.staffMemberName,
            email: req.body.email,
            mobileNo: req.body.mobileNo,
            gender: req.body.gender,
            staffMemberImage: filepath
        });
        return res.status(StatusCodes.OK).json({ message: 'StaffMember updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Update failed' });
    }
};
