const userLoginInfo = require("../models/users.model");
const userInfo = require("../models/userInfo.model");
const index = require('../index');
const cheerio = require('cheerio');
const fs = require('fs');

var activeUser;

// get all users
const getAllUsers = async (req, res) => {
  try {
    const id = await userLoginInfo.findOne({ id: req.body.id });

    if (id == null) {
      fs.readFile(index.dirname + "/views/index.html", 'utf8', function (err, data) {

        if (err) throw err;

        var $ = cheerio.load(data);

        $('p.warning').text("Wrong ID or Password");
        $.html();
        res.send($.html());
      });
    }
    else if (id.password == req.body.password) {
      activeUser = await userInfo.findOne({ id: req.body.id });
      fs.readFile(index.dirname + "/views/home.html", 'utf8', function (err, data) {

        if (err) throw err;

        var $ = cheerio.load(data);

        $('h1').text("Hi! " + activeUser.name);

        $.html();
        res.send($.html());
      });
    }
    else {
      fs.readFile(index.dirname + "/views/index.html", 'utf8', function (err, data) {

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


const loadUserProfile = async (req, res) => {

  if (getActiveUser() == null) {
    res.redirect("/");
  }
  else {
    fs.readFile(index.dirname + "/views/profile.html", 'utf8', function (err, data) {

      if (err) throw err;

      var $ = cheerio.load(data);

      $('title').text(getActiveUser().name);

      $('div.name').text(getActiveUser().name);

      $('td.uname').text(getActiveUser().name);
      $('td.id').text(getActiveUser().id);
      $('td.department').text(getActiveUser().department);
      $('td.session').text(getActiveUser().session);
      $('td.phone').text("+880" + getActiveUser().phone);
      $('td.email').text(getActiveUser().email);

      $('h1').text("Profile");

      $.html();
      res.send($.html());
    });
  }
};

const loadClassMates = async (req, res) => {

  if (getActiveUser == null) {
    res.redirect("/");
  }
  else {
    fs.readFile(index.dirname + "/views/class.html", 'utf8', function (err, data) {

      if (err) throw err;

      var $ = cheerio.load(data);

      //$('h1').text("Hilu! " + " [ " + activeUser.name + " ]");

      $.html();
      res.send($.html());
    });
  }
};


// get one user
/*
const getOneUser = async (req, res) => {
  try {
    const user = await userLoginInfo.findOne({ id: req.params.id });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};*/

// create user
const createUser = async (req, res) => {
  try {
    const id = await userLoginInfo.findOne({ id: req.body.id });

    const existing = await userInfo.findOne({ id: req.body.id });

    if (id != null) {

      fs.readFile(index.dirname + "/views/oksignedup.html", 'utf8', function (err, data) {

        if (err) throw err;

        var $ = cheerio.load(data);

        $('h1').text("Already Registered");
        $.html();
        res.send($.html());
      });
    }

    else if (existing == null) {
      fs.readFile(index.dirname + "/views/signup.html", 'utf8', function (err, data) {

        if (err) throw err;

        var $ = cheerio.load(data);

        $('p.warning').text("ID not registered, please contact your admin");
        $.html();
        res.send($.html());
      });
    }

    else {
      var tPass = req.body.password;
      if (tPass.toString().length < 6) {
        fs.readFile(index.dirname + "/views/signup.html", 'utf8', function (err, data) {

          if (err) throw err;

          var $ = cheerio.load(data);

          $('p.warning').text("Password can't be less than 6 characters");
          $.html();
          res.send($.html());
        });
      }
      else {
        const newUser = new userLoginInfo({
          id: req.body.id,
          password: req.body.password,
        });
        await newUser.save();
        fs.readFile(index.dirname + "/views/oksignedup.html", 'utf8', function (err, data) {

          if (err) throw err;

          var $ = cheerio.load(data);

          $('h1').text("Registration Successfull");
          $.html();
          res.send($.html());
        });
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};


// sign out
const signOut = async (req, res) => {
  activeUser = null;
  res.redirect("/");
};

function getActiveUser() {
  return activeUser;
}

/*
// update user
const updateUser = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    user.name = req.body.name;
    user.age = Number(req.body.age);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// delete user
const deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ id: req.params.id });
    res.status(200).json({ message: "user is deleted" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};*/

module.exports = { getAllUsers, createUser, getActiveUser, loadUserProfile, loadClassMates, signOut };