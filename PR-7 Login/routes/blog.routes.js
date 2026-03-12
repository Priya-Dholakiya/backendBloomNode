const express = require('express');
const { getdashboard, addblogpage, addblog, viewblog, deleteblog, editblog, updateblog, view } = require('../controller/blog.controller');
const uploadsimage = require('../middleware/image.uploads');
const routes = require('./admin.routes');

const router = express.Router();


router.get("/add-blog", addblogpage);
router.post("/add-blog", uploadsimage.single("BlogImage"), addblog);
router.get("/view-blog", viewblog);
router.get("/delete-blog/:id", deleteblog);
router.get("/edit-blog/:id", editblog);
router.post("/update-blog/:id", uploadsimage.single("BlogImage"), updateblog);
router.get("/view/:id", view);


module.exports = router;