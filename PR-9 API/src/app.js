const express = require('express');
const dbConnect = require('./config/DBConnect');
const port = 3000;
const app = express();

// Connect to database
dbConnect();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("src/uploads"));

// Routes
app.use("/api", require("./routes/index.routes"));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
