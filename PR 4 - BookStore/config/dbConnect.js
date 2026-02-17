const mongoose = require("mongoose");
function dbConnect() {
  mongoose
    .connect(
      "mongodb+srv://priya:priya%4016@cluster0.f4gaei5.mongodb.net/?appName=Cluster0",
    )
    .then(() => console.log("Database Connected"))
    .catch((error) => console.log(error));
}
module.exports = dbConnect;
