const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    Firstname: {
        type: String
    },
    Lastname: {
        type: String
    },
    Email: {
        type: String
    },
    gender: {
        type: String,
        enum: ["Male", "Female"]
    },
    Password: {
        type: String
    },
    ProfileImage: {
        type: String
    }

})

module.exports = mongoose.model('admin', adminSchema);