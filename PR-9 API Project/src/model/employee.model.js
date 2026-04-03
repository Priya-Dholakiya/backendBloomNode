const mongoose = require('mongoose');

const employeeschema = mongoose.Schema({
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
        default: "employee",
    },
    eprofileImage: {
        type: String
    },
    isDelete:{
        type:Boolean,
        default:false
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('employee', employeeschema)