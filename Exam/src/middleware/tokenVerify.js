const JWT = require('jsonwebtoken');
const Admin = require('../model/admin.model');
const { StatusCodes } = require('http-status-codes');

const adminToken = async (req, res, next) => {
    let authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not Authorize !' })
    }

    let adminToken = authorization.split(" ")[1]
    let { adminId } = JWT.verify(adminToken, 'web-app')

    let admin = await Admin.findById(adminId)

    if (admin) {
        req.user = admin
        next();
    } else {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid Token' })
    }
}


module.exports = adminToken;