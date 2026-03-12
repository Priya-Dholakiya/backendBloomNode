const express = require("express");
const port = 8888;
const dbconnect = require("./config/db.connect");
const app = express();
const session = require("express-session");
const passport = require("./middleware/localstrategy");
const flash = require("connect-flash");
const flashmessage = require("./middleware/flashmessage");

dbconnect();

app.set("view engine", "ejs");
app.use(express.urlencoded());
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
  console.log(`server is starting at http://localhost:${port}`);
});
