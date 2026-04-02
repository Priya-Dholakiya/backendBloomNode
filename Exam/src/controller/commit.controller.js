const { StatusCodes } = require("http-status-codes");
const Commit = require('../model/commit.model');

exports.addComment = async (req, res) => {
    try {
        let comment = await Commit.create({ ...req.body });

        return res.status(StatusCodes.CREATED).json({ message: "Comment Added", comment });

    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
    }
};
