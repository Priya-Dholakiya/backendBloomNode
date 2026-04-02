const express = require("express");
const adminToken = require("../middleware/tokenVerify");
const { addComment } = require("../controller/commit.controller");

const router = express.Router();

router.post("/add-commit/:id", adminToken, addComment);

module.exports = router;
