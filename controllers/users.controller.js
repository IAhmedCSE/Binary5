const userLoginInfo = require("../models/users.model");
const index = require('../index');
const cheerio = require('cheerio');
const fs = require('fs');

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
      res.sendFile(index.dirname + "/views/home.html");
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

// get one user
const getOneUser = async (req, res) => {
  try {
    const user = await userLoginInfo.findOne({ id: req.params.id });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// create user
const createUser = async (req, res) => {
  try {
    const id = await userLoginInfo.findOne({ id: req.body.id });

    if (id != null) {

      fs.readFile(index.dirname + "/views/oksignedup.html", 'utf8', function (err, data) {

        if (err) throw err;

        var $ = cheerio.load(data);

        $('h1').text("Already Registered");
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
        //await newUser.save();
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
};

module.exports = { getAllUsers, getOneUser, createUser, updateUser, deleteUser };