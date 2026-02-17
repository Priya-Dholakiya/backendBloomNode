const express = require("express");
const dbconnect = require("./config/dbconnect");
const Movie = require("./model/movieModel");

const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

dbconnect();

app.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.render("index", { movies });
  } catch (error) {
    console.log(error);
    res.render("index", { Movies: [] });
  }
});

app.post("/Moviedata", async (req, res) => {
  try {
    const { moviename, author, price, category, img } = req.body;

    if (!moviename || !author || !price || !category || !img) {
      return res.send("All fields are required");
    }

    await Movie.create({ moviename, author, price, category, img });
    console.log("Movie Added:", req.body);
    res.redirect("/");
  } catch (err) {
    console.log("Add Movie Error:", err);
    res.send("Error adding movie");
  }
});
app.get("/delete/:id", async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  return res.redirect("/");
});
app.get("/edit/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.render("edit", { movie });
  } catch (error) {
    console.log(error);
    res.send("Edit page error");
  }
});
app.post("/edit/:id", async (req, res) => {
  try {
    await Movie.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send("Update error");
  }
});

app.listen(3000, () => {
  console.log("Server Start at http://localhost:3000");
});
