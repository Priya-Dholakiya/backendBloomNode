const bookModel = require("../model/book.model");
const path = require("path");
const fs = require("fs");

exports.homepage = async (req, res) => {
  const book = await bookModel.find().sort({ createdAt: -1 });
  res.render("index", { book });
};

exports.addBook = async (req, res) => {
  try {
    let imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const bookObj = {
      ...req.body,
      imagePath,
    };

    await bookModel.create(bookObj);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("Error adding book");
  }
};

exports.deleteBook = async (req, res) => {
  const book = await bookModel.findById(req.query.id);

  if (book?.imagePath) {
    fs.unlinkSync(path.join(__dirname, "..", "public", book.imagePath));
  }

  await bookModel.findByIdAndDelete(req.query.id);
  res.redirect("/");
};

exports.editBook = async (req, res) => {
  const book = await bookModel.findById(req.query.id);
  res.render("edit", { book });
};

exports.editBookPost = async (req, res) => {
  const oldBook = await bookModel.findById(req.query.id);

  let imagePath = oldBook.imagePath;
  if (req.file) {
    fs.unlinkSync(path.join(__dirname, "..", "public", oldBook.imagePath));
    imagePath = `/uploads/${req.file.filename}`;
  }

  await bookModel.findByIdAndUpdate(req.query.id, {
    ...req.body,
    imagePath,
  });

  res.redirect("/");
};

exports.search = async (req, res) => {
  const q = (req.body.search || "").trim();

  const book = await bookModel.find({
    $or: [
      { title: new RegExp(q, "i") },
      { author: new RegExp(q, "i") },
      { genre: new RegExp(q, "i") },
      { discription: new RegExp(q, "i") },
    ],
  });

  res.render("index", { book });
};