require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
// passport config
require("./config/passport")(passport);

const app = express();

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// express session
app.use(
  session({
    secret: "ehbvoefdb",
    resave: true,
    saveUninitialized: true,
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// enable cors for every domain
app.use(cors());

//require connection string from .env
const dbstring = process.env.MONGO_STR;
//connect to mongo
mongoose
  .connect(encodeURI(dbstring), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.error(err));

//routes
app.use("/", require("./routes/home"));
app.use("/api/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("server started and listen on port " + PORT));
