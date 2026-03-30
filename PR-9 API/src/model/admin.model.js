const mongoose = require('mongoose');

const superUserSchema = mongoose.Schema({
    superUserName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    superUserImage: {
        type: String
    },
    role: {
        type: String,
        default: 'SuperUser'
    },
    gender: {
        type: String,
        enum: ['Male', 'Female']
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

module.exports = mongoose.model('SuperUser', superUserSchema);
