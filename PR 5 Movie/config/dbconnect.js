const mongoose = require("mongoose");

const dbconnect = () => {
  mongoose
    .connect(
      "mongodb+srv://khushpatel00:atlasadmin@cluster0.ixqbyv9.mongodb.net/MovieStore",
    )
    .then(() => {
      console.log("✅ DB Connected Successfully");
    })
    .catch((error) => {
      console.log("❌ DB Connection Error:", error);
    });
};

module.exports = dbconnect;
