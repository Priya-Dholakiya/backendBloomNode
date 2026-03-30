const mongoose = require('mongoose');

const teamLeadSchema = mongoose.Schema({
    superUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SuperUser'
    },
    teamLeadName: {
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
    teamLeadImage: {
        type: String
    },
    role: {
        type: String,
        default: 'teamLead'
    },
    department: {
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

module.exports = mongoose.model('TeamLead', teamLeadSchema);
