const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.static( "public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
const path = require("path");

const dbConnect = require('./config/dbConnect');
dbConnect();


app.use("/", require("./routes/index.routes"));

app.listen(9001, () => {
  console.log("app started at http://localhost:9001");
});