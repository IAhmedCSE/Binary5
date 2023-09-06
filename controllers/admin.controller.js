const admin = require("../models/admin.model");
const index = require('../index');
const cheerio = require('cheerio');
const fs = require('fs');

// admin page
const adminPage = async (req, res) => {
    res.sendFile(index.dirname + "/views/admin.html");
};

var activeAdmin;

// admin login
const adminLogin = async (req, res) => {
    try {
        const id = await admin.findOne({ id: req.body.id });

        if (id == null) {
            fs.readFile(index.dirname + "/views/admin.html", 'utf8', function (err, data) {

                if (err) throw err;

                var $ = cheerio.load(data);

                $('p.warning').text("Wrong ID or Password");
                $.html();
                res.send($.html());
            });
        }
        else if (id.password == req.body.password) {
            // to create a new user
            //res.sendFile(index.dirname + "/views/newUser.html");

            activeAdmin = id;

            fs.readFile(index.dirname + "/views/newUser.html", 'utf8', function (err, data) {

                if (err) throw err;

                var $ = cheerio.load(data);

                $('h1').text("Admin : " + id.id + " [ "+ id.name +" ]");
                $.html();
                res.send($.html());
            });
        }
        else {
            fs.readFile(index.dirname + "/views/admin.html", 'utf8', function (err, data) {

                if (err) throw err;

                var $ = cheerio.load(data);

                $('p.warning').text("Wrong ID or Password");
                $.html();
                res.send($.html());
            });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

function getActiveAdmin(){
    return activeAdmin;
}


module.exports = { adminLogin, adminPage, getActiveAdmin };