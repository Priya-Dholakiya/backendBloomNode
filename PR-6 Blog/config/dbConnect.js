const mongoose = require('mongoose');

const dbConnect = () => {
    mongoose
      .connect(
        "mongodb+srv://priya:priya%404016@cluster0.f4gaei5.mongodb.net/login",
      )
      .then(() => console.log("Database connected successfully"))
      .catch((err) => console.log(err));
};

module.exports = dbConnect;