const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

mongoose
  .connect(
    "mongodb+srv://priya:priya%408280@cluster0.f4gaei5.mongodb.net/bookstore?appName=Cluster0",
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", require("./routes/index.routes"));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
