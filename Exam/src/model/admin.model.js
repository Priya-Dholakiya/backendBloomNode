const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    adminName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    adminImage: {
        type: String
    },
    role: {
        type: String,
        default: 'Admin'
    }
},
{
    versionKey:false,
    timestampes:true
})

module.exports = mongoose.model('Admin', adminSchema);