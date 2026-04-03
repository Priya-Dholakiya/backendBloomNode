const mongoose = require('mongoose')

const managerschema = mongoose.Schema({
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
    mprofileImage: {
        type: String
    },
    role: {
        type: String,
        default: "manager"
    },
    department: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('manager', managerschema)