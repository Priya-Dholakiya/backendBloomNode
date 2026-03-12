const mongoose = require('mongoose');

const dbconnect = () => {
    mongoose
      .connect(
        "mongodb+srv://priya:priya%404016@cluster0.f4gaei5.mongodb.net/admin-panel",
      )
      .then(() => {
        console.log("database is connected successfully");
      })
      .catch((err) => {
        console.log(err);
      });
}

module.exports = dbconnect;

