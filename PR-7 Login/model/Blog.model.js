const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    Title: {
        type: String
    },
    Category:{
        type: String
    },
    Description:{
        type: String
    },
    BlogImage:{
        type: String
    },
    Name:{
        type:String
    },
    Status:{
        type: String
    },
    Date:{
        type: String
    }
})

module.exports = mongoose.model("blog", blogSchema);

