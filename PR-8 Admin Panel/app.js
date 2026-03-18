const express = require("express");
let port = 9000;
const app = express();
const dbconnect = require("./config/db.connect");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const localstrategy = require("./middleware/localstrategy").Strategy;
const session = require("express-session");
const flash = require("connect-flash");
const flashmessage = require("./middleware/flashmessage");

dbconnect();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(flash());
app.use("/uploads", express.static("uploads"));

app.use(
  session({
    name: "admin-panel",
    secret: "test",
    saveUninitialized: "false",
    resave: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setuser);
app.use(flashmessage);

app.use("/", require("./routes/auth.routes"));

app.listen(port, () => {
  console.log(`server is starting http://localhost:${port}`);
});
