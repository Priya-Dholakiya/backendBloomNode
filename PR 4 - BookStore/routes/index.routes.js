const express = require("express");
const router = express.Router();
const root = require("../Controller/index.controller");
const upload = require("../middleware/book.multer");

// Home
router.get("/", root.homepage);

// Add
router.post("/addBook", upload.single("coverImage"), root.addBook);

// Delete
router.post("/deleteBook", root.deleteBook);

// Edit
router.get("/editBook", root.editBook);
router.post("/editBook", upload.single("coverImage"), root.editBookPost);

// Search
router.post("/search", root.search);

module.exports = router;
