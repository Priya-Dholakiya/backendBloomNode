const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: {
        type: String
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recip"
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
});

module.exports = mongoose.model("Comment", commentSchema);
