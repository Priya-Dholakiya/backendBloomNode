
const mongoose = require('mongoose');

const dbConnect = () => {
    mongoose
      .connect(
        "mongodb+srv://priya:priya%4016@cluster0.gv6g9lu.mongodb.net/?appName=Cluster0",
      )
      .then(() => console.log("Db connected..!"))
      .catch((err) => console.log(err));
};

module.exports = dbConnect;