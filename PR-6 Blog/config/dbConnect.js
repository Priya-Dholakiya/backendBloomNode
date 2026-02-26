const mongoose = require('mongoose');

const dbConnect = () => {
    mongoose.connect(
        "mongodb+srv://piyudholakiya81_db_user:paz2kRUp6Eyd5AiJ@cluster0.zjjtcyq.mongodb.net/?appName=Cluster0"
    )
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.log(err));
};

module.exports = dbConnect;
