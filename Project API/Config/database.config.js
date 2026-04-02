const mongoose = require('mongoose');

function connection(){
    mongoose.connect("mongodb+srv://priya:priya%404016@cluster0.f4gaei5.mongodb.net/admin-panel")
        .then(() => console.log('Connect Database.........!'))
        .catch((error) => console.error(`error`)); 
}

module.exports = connection;