const JWT = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const SuperUser = require('../model/admin.model');
const TeamLead = require('../model/manager.model');
const StaffMember = require('../model/employee.model');

const superUserToken = async (req, res, next) => {
    try {
        let authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'No token provided' });
        }
        let token = authorization.split(" ")[1];
        let { superUserId } = JWT.verify(token, 'super-role-su');
        let superUser = await SuperUser.findById(superUserId);
        if (superUser) {
            req.user = superUser;
            next();
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
        }
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token verification failed' });
    }
};

const teamLeadToken = async (req, res, next) => {
    try {
        let authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'No token provided' });
        }
        let token = authorization.split(" ")[1];
        let { teamLeadId } = JWT.verify(token, 'team-lead-key');
        let teamLead = await TeamLead.findById(teamLeadId);
        if (teamLead) {
            req.user = teamLead;
            next();
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
        }
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token verification failed' });
    }
};

const staffMemberToken = async (req, res, next) => {
    try {
        let authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'No token provided' });
        }
        let token = authorization.split(" ")[1];
        let { staffMemberId } = JWT.verify(token, 'staff-role-sm');
        let staffMember = await StaffMember.findById(staffMemberId);
        if (staffMember) {
            req.user = staffMember;
            next();
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
        }
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token verification failed' });
    }
};

module.exports = { superUserToken, teamLeadToken, staffMemberToken };
