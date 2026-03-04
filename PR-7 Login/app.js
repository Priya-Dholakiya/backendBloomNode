const express = require("express");
const port = 8000;

const app = express();
const dbConnect = require('./config/dbConnect');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require("./middleware/localStrategy");
const session = require('express-session');

// dbConnection
dbConnect();

//middleware
app.set("view engine", 'ejs');
app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.static('public'))
app.use("/uploads", express.static("uploads"));

app.use(session({
    name:'web-developement',
    secret: 'demo',
    saveUninitialized:false,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 10
    }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticate)

// routes
app.use("/", require('./routes/index.routes'));

app.listen(port, () => {
    console.log(`Server start at http://localhost:${port}`);
})