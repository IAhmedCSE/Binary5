const express = require('express');
const cors = require('cors');
require("./config/db");
const bodyParser = require('body-parser');
const usersRouter = require("./routes/users.route");
const adminsRouter = require("./routes/admin.route");
const facultyRouter = require("./routes/faculty.route");
const cheerio = require('cheerio');
const fs = require('fs');

const { createUser, getOneClassMate } = require('./controllers/users.controller');

const app = express();

app.use(express.static("views"));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use("/",usersRouter);

app.use("/admin",adminsRouter);

app.use("/faculty-signin",facultyRouter);

app.get("/signup",(req,res) => {
    res.sendFile(__dirname + "/views/signup.html");
});

app.get("/verify-ID-OTP",(req,res) => {
    res.sendFile(__dirname + "/views/verify-ID-OTP.html");
});

app.post("/signup",createUser);

app.get("/:id([0-9]{10})", getOneClassMate);

// home route
app.get("/", (req,res) => {
    res.sendFile(__dirname + "/views/index.html");
});

// route not found error
app.use((req,res,next) => {
    
    fs.readFile(__dirname + "/views/error.html", 'utf8', function(err, data) {

        if (err) throw err;
    
        var $ = cheerio.load(data);
    
        $('h1').text("404 Not Found");
        $.html();
        res.send($.html());
    });
});

// server error
app.use((err,req,res,next) => {
    fs.readFile(__dirname + "/views/error.html", 'utf8', function(err, data) {

        if (err) throw err;
    
        var $ = cheerio.load(data);
    
        $('h1').text("Something is wrong");
        $.html();
        res.send($.html());
    });
});

module.exports = app;