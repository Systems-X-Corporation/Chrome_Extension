const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/verifylogin", (req, res) => {
  let token = req.cookies.token;
  jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
    if (err) {
      res.status(401).json({ verified: false });
    }
    if (decoded.email == process.env.LOGIN_EMAIL) {
      res.status(200).json({ verified: true });
    } else {
      res.status(401).json({ verified: false });
    }
    // console.log(decoded.foo) // bar
  });
});
app.post("/adminlogin", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (
    email == process.env.LOGIN_EMAIL &&
    password == process.env.LOGIN_PASSWORD
  ) {
    let token = jwt.sign({ email }, process.env.JWT_KEY);
    res.cookie("token", token);
    res.status(200).json({
      message: "Login Successfull",
    });
  } else {
    res.cookie("token", "");
    res.status(401).json({
      message: "Invalid Credentials",
    });
  }
});

app.post("/generateToken", (req, res) => {
  let pcn = req.body.pcn;
  let token = jwt.sign({ pcn }, process.env.JWT_KEY);
  console.log(token);
  res.status(200).json({ token });
});
app.post("/verifyToken", (req, res) => {
  let pcn = req.body.pcn;
  let token = req.body.token;
  // let data = jwt.verify(token, process.env.JWT_KEY)
  jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
    if (err) {
      res.status(401).json({ verified: false });
    }
    if (decoded.pcn == pcn) {
      res.status(200).json({ verified: true });
    } else {
      res.status(401).json({ verified: false });
    }
    // console.log(decoded.foo) // bar
  });
});

app.listen(PORT, () => {
  console.log(`App is lostening on http://localhost:${PORT}`);
});
