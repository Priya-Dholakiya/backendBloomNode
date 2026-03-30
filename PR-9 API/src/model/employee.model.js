const mongoose = require('mongoose');

const staffMemberSchema = mongoose.Schema({
    staffMemberName: {
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
        default: "StaffMember",
    },
    staffMemberImage: {
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

module.exports = mongoose.model('StaffMember', staffMemberSchema)
