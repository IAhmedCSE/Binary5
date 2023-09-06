const userInfo = require("../models/userInfo.model");
const { getActiveAdmin } = require('../controllers/admin.controller');
const index = require('../index');
const cheerio = require('cheerio');
const fs = require('fs');


// create new user
const createNewUser = async (req, res) => {
  try {

    const admin = getActiveAdmin();

    const user = await userInfo.findOne({ id: req.body.id });

    if (user != null) {

      fs.readFile(index.dirname + "/views/newUser.html", 'utf8', function (err, data) {

        if (err) throw err;

        var $ = cheerio.load(data);

        $('h1').text("Admin : " + admin.id + " [ " + admin.name + " ]");
        $('p.status').text("User Already Exists");
        $.html();
        res.send($.html());
      });
    }
    else {

      const newUser = new userInfo({
        id: req.body.id,
        name: req.body.name,
        department: req.body.department,
        session: req.body.session,
        phone: req.body.phone,
        email: req.body.email,
      });

      await newUser.save();
      fs.readFile(index.dirname + "/views/newUser.html", 'utf8', function (err, data) {

        if (err) throw err;

        var $ = cheerio.load(data);

        $('h1').text("Admin : " + admin.id + " [ " + admin.name + " ]");
        $('p.status').text("New User Created");
        $.html();
        res.send($.html());
      });

    }

  } catch (error) {
    res.status(500).send(error.message);
  }
};


module.exports = { createNewUser };