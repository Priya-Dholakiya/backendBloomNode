const mongoose = require('mongoose')

const adminschema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    mobileNo: {
        type: Number
    },
    role: {
        type: String,
        default: "admin",
    },
    profileImage: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    }


},
    {
        timestamps: true,
        versionKey: false
    })

module.exports = mongoose.model('admin', adminschema)