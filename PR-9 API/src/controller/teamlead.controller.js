const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const TeamLead = require('../model/manager.model');
const StaffMember = require('../model/employee.model');
const sendEmail = require('../middleware/nodemailar');

exports.loginTeamLead = async (req, res) => {
    try {
        let teamLead = await TeamLead.findOne({ email: req.body.email, isDelete: false });
        if (!teamLead) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'TeamLead not found' });
        }
        let match = await bcrypt.compare(req.body.password, teamLead.password);
        if (!match) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
        }
        let payload = { teamLeadId: teamLead._id };
        let token = JWT.sign(payload, 'team-lead-key');
        return res.status(StatusCodes.OK).json({ message: 'Login successful', teamLead, token });
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

exports.updateTeamLead = async (req, res) => {
    try {
        let teamLead = await TeamLead.findById(req.params.id);
        if (!teamLead || teamLead.isDelete) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'TeamLead not found' });
        }
        let filepath = teamLead.teamLeadImage;
        if (req.file) {
            if (teamLead.teamLeadImage) {
                fs.unlinkSync(path.join(__dirname, '..', teamLead.teamLeadImage));
            }
            filepath = `/uploads/${req.file.filename}`;
        }
        await TeamLead.findByIdAndUpdate(req.params.id, {
            teamLeadName: req.body.teamLeadName,
            email: req.body.email,
            department: req.body.department,
            gender: req.body.gender,
            teamLeadImage: filepath
        });
        return res.status(StatusCodes.OK).json({ message: 'TeamLead updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Update failed' });
    }
};

exports.addStaffMember = async (req, res) => {
    try {
        let exist = await StaffMember.findOne({ email: req.body.email, isDelete: false });
        if (exist) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "StaffMember already exists" });
        }
        let imagePath = req.file ? `/uploads/${req.file.filename}` : "";
        let hashPassword = await bcrypt.hash(req.body.password, 10);
        let staffMember = await StaffMember.create({
            staffMemberName: req.body.staffMemberName,
            email: req.body.email,
            password: hashPassword,
            staffMemberImage: imagePath,
            gender: req.body.gender,
            mobileNo: req.body.mobileNo
        });
        let message = {
            from: 'noreply@company.com',
            to: req.body.email,
            subject: 'Welcome to Team',
            html: `<h3>Welcome ${req.body.staffMemberName}</h3><p>Your StaffMember account created by TeamLead.</p><p>Email: ${req.body.email}</p><p>Password: ${req.body.password}</p>`
        };
        sendEmail(message);
        return res.status(StatusCodes.CREATED).json({ message: 'StaffMember created', staffMember });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Creation failed' });
    }
};

exports.getAllStaffMembers = async (req, res) => {
    try {
        let staff = await StaffMember.find({ isDelete: false });
        return res.status(StatusCodes.OK).json({ message: 'All StaffMembers', staff });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching' });
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
        return res.status(StatusCodes.OK).json({ message: 'StaffMember updated' });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Update failed' });
    }
};

exports.deleteStaffMember = async (req, res) => {
    try {
        let id = req.params.id;
        let staffMember = await StaffMember.findById(id);
        if (!staffMember || staffMember.isDelete) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'StaffMember not found' });
        }
        if (staffMember.staffMemberImage) {
            fs.unlinkSync(path.join(__dirname, '..', staffMember.staffMemberImage));
        }
        await StaffMember.findByIdAndUpdate(id, { isDelete: true });
        return res.status(StatusCodes.OK).json({ message: 'StaffMember deleted' });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Delete failed' });
    }
};
