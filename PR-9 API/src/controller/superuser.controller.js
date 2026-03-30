const { StatusCodes } = require('http-status-codes');
const SuperUser = require('../model/admin.model');
const TeamLead = require('../model/manager.model');
const StaffMember = require('../model/employee.model');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const sendEmail = require('../middleware/nodemailar');

exports.registerSuperUser = async (req, res) => {
    try {
        let exist = await SuperUser.findOne({ email: req.body.email, isDelete: false });
        if (exist) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "SuperUser already exists" });
        }
        let imagePath = req.file ? `/uploads/${req.file.filename}` : "";
        let hashPassword = await bcrypt.hash(req.body.password, 10);
        let superUser = await SuperUser.create({
            superUserName: req.body.superUserName,
            email: req.body.email,
            password: hashPassword,
            superUserImage: imagePath,
            gender: req.body.gender
        });
        return res.status(StatusCodes.CREATED).json({ message: 'SuperUser created successfully', superUser });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'SuperUser creation failed' });
    }
};

exports.loginSuperUser = async (req, res) => {
    try {
        let superUser = await SuperUser.findOne({ email: req.body.email, isDelete: false });
        if (!superUser) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'SuperUser not found' });
        }
        let match = await bcrypt.compare(req.body.password, superUser.password);
        if (!match) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
        }
        let payload = { superUserId: superUser._id };
        let token = JWT.sign(payload, 'super-role-su');
        return res.status(StatusCodes.OK).json({ message: 'Login successful', superUser, token });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Login failed' });
    }
};

exports.getAllSuperUsers = async (req, res) => {
    try {
        let users = await SuperUser.find({ isDelete: false });
        return res.status(StatusCodes.OK).json({ message: 'All SuperUsers', users });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching SuperUsers' });
    }
};

exports.getSuperUser = async (req, res) => {
    try {
        let id = req.params.id;
        let superUser = await SuperUser.findById(id);
        if (!superUser || superUser.isDelete) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'SuperUser not found' });
        }
        return res.status(StatusCodes.OK).json({ message: 'SuperUser details', superUser });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
};

exports.deleteSuperUser = async (req, res) => {
    try {
        let id = req.params.id;
        let superUser = await SuperUser.findById(id);
        if (!superUser || superUser.isDelete) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'SuperUser not found' });
        }
        if (superUser.superUserImage) {
            let filepath = path.join(__dirname, '..', superUser.superUserImage);
            fs.unlinkSync(filepath);
        }
        await SuperUser.findByIdAndUpdate(id, { isDelete: true });
        return res.status(StatusCodes.OK).json({ message: 'SuperUser deleted' });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Delete failed' });
    }
};

exports.updateSuperUser = async (req, res) => {
    try {
        let superUser = await SuperUser.findById(req.params.id);
        if (!superUser || superUser.isDelete) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'SuperUser not found' });
        }
        let filepath = superUser.superUserImage;
        if (req.file) {
            if (superUser.superUserImage) {
                fs.unlinkSync(path.join(__dirname, '..', superUser.superUserImage));
            }
            filepath = `/uploads/${req.file.filename}`;
        }
        await SuperUser.findByIdAndUpdate(req.params.id, {
            superUserName: req.body.superUserName,
            email: req.body.email,
            gender: req.body.gender,
            superUserImage: filepath
        }, { new: true });
        return res.status(StatusCodes.OK).json({ message: 'SuperUser updated' });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Update failed' });
    }
};

exports.myProfile = async (req, res) => {
    try {
        return res.status(StatusCodes.OK).json({ message: 'Profile', data: req.user });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        let { oldPass, newPass, confirmPass } = req.body;
        let superUser = req.user;
        if (!await bcrypt.compare(oldPass, superUser.password)) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Old password incorrect' });
        }
        if (newPass !== confirmPass) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Passwords do not match' });
        }
        let hash = await bcrypt.hash(newPass, 10);
        await SuperUser.findByIdAndUpdate(superUser._id, { password: hash });
        return res.status(StatusCodes.OK).json({ message: 'Password updated' });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error' });
    }
};

exports.addTeamLead = async (req, res) => {
    try {
        let exist = await TeamLead.findOne({ email: req.body.email });
        if (exist) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "TeamLead already exists" });
        }
        let imagePath = req.file ? `/uploads/${req.file.filename}` : "";
        let hashPassword = await bcrypt.hash(req.body.password, 10);
        let teamLead = await TeamLead.create({
            superUserId: req.user._id,
            teamLeadName: req.body.teamLeadName,
            email: req.body.email,
            password: hashPassword,
            teamLeadImage: imagePath,
            gender: req.body.gender,
            department: req.body.department
        });
        let message = {
            from: 'noreply@company.com',
            to: req.body.email,
            subject: 'Welcome to Team',
            html: `<h3>Welcome ${req.body.teamLeadName}</h3><p>Your TeamLead account created.</p><p>Email: ${req.body.email}</p><p>Password: ${req.body.password}</p>`
        };
        sendEmail(message);
        return res.status(StatusCodes.CREATED).json({ message: 'TeamLead created', teamLead });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'TeamLead creation failed' });
    }
};

exports.getAllTeamLeads = async (req, res) => {
    try {
        let leads = await TeamLead.find({ isDelete: false });
        return res.status(StatusCodes.OK).json({ message: 'All TeamLeads', leads });
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
        return res.status(StatusCodes.OK).json({ message: 'TeamLead updated' });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Update failed' });
    }
};

exports.deleteTeamLead = async (req, res) => {
    try {
        let id = req.params.id;
        let teamLead = await TeamLead.findById(id);
        if (!teamLead || teamLead.isDelete) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'TeamLead not found' });
        }
        if (teamLead.teamLeadImage) {
            fs.unlinkSync(path.join(__dirname, '..', teamLead.teamLeadImage));
        }
        await TeamLead.findByIdAndUpdate(id, { isDelete: true });
        return res.status(StatusCodes.OK).json({ message: 'TeamLead deleted' });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Delete failed' });
    }
};

exports.getAllStaffMembers = async (req, res) => {
    try {
        let staff = await StaffMember.find({ isDelete: false });
        return res.status(StatusCodes.OK).json({ message: 'All StaffMembers', staff });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error' });
    }
};
