const express = require('express');
const port = 8018;
const app = express();
const dbConnect = require('./config/dbConnect');

//Database
dbConnect();

// middleware
app.use(express.urlencoded());
app.use(express.json());
app.use('/uploads', express.static("uploads"));


// Routes
app.use("/api", require("./routes/index.routes"));

app.listen(port, () =>{
    console.log(`Server Start at http://localhost:${port}`);    
})