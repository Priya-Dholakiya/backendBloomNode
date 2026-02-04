const mongoose = require('mongoose');
function dbConnect(){
    mongoose.connect("mongodb+srv://khushpatel00:atlasadmin@cluster0.ixqbyv9.mongodb.net/BookStore")
    .then(()=> console.log('Database Connected'))
    .catch((error)=> console.log(error))

} 
module.exports = dbConnect;