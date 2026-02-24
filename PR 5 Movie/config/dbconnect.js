const mongoose = require("mongoose");

const dbconnect = () => {
  mongoose
    .connect(
      "mongodb+srv://priya:priya%4016@cluster0.f4gaei5.mongodb.net/moviedb?retryWrites=true&w=majority",
    )
    .then(() => {
      console.log("✅ DB Connected Successfully");
    })
    .catch((error) => {
      console.log("❌ DB Connection Error:", error);
    });
};

module.exports = dbconnect;
