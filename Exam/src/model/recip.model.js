const mongoose = require("mongoose");

const recipSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    recipeImage: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
});

module.exports = mongoose.model("Recip", recipSchema);
