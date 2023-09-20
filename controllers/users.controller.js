const userLoginInfo = require("../models/users.model");
const userInfo = require("../models/userInfo.model");
const index = require('../index');
const cheerio = require('cheerio');
const fs = require('fs');
//const { nodemailer, mailReceiver, mailSubject, mailBody, sendMail } = require('../controllers/mailer.controller');
const { sendTheMail } = require('../controllers/mailer.controller');

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


// load whole class
const loadClassMates = async (req, res) => {

  if (getActiveUser == null) {
    res.redirect("/");
  }
  else {

    var base = { session: -1, id: 1 };
    allUsers = await userInfo.find().sort(base);

    fs.readFile(index.dirname + "/views/class.html", 'utf8', function (err, data) {

      if (err) throw err;

      var $ = cheerio.load(data);


      var it;
      for (it = 0; it < allUsers.length; it++) {
        $('div.container').append('<div class="card"><img src="https://lh3.googleusercontent.com/ytP9VP86DItizVX2YNA-xTYzV09IS7rh4WexVp7eilIcfHmm74B7odbcwD5DTXmL0PF42i2wnRKSFPBHlmSjCblWHDCD2oD1oaM1CGFcSd48VBKJfsCi4bS170PKxGwji8CPmehwPw=w200-h247-no" alt="Person" class="card__image"> <p class="card__name">' + allUsers[it].name + '</p> <div class="grid-container"> <div class="grid-child-idU">' + allUsers[it].id + ' </div> </div> <button class="btn draw-border"><a class="viewProfileBtn" href= "/' + allUsers[it].id + '">Profile</a></button> </div>');
      }


      $.html();
      res.send($.html());
    });

  }
};


// show classmates profile

const getOneClassMate = async (req, res) => {
  try {
    if (getActiveUser() == null) {
      res.redirect("/");
    }
    else {

      var oneClassMate = await userInfo.findOne({ id: req.params.id });

      if (oneClassMate == null) {
        res.redirect("/");
      }

      else {
        fs.readFile(index.dirname + "/views/profile.html", 'utf8', function (err, data) {

          if (err) throw err;

          var $ = cheerio.load(data);

          $('title').text(oneClassMate.name);

          $('div.name').text(oneClassMate.name);

          $('td.uname').text(oneClassMate.name);
          $('td.id').text(oneClassMate.id);
          $('td.department').text(oneClassMate.department);
          $('td.session').text(oneClassMate.session);
          $('td.phone').text("+880" + oneClassMate.phone);
          $('td.email').text(oneClassMate.email);

          $('h1').text("Profile");

          $.html();
          res.send($.html());
        });
      }

    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

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
      var conPass = req.body.conpassword;

      if (tPass.toString().length < 6) {
        fs.readFile(index.dirname + "/views/signup.html", 'utf8', function (err, data) {

          if (err) throw err;

          var $ = cheerio.load(data);

          $('p.warning').text("Password can't be less than 6 characters");
          $.html();
          res.send($.html());
        });
      }

      else if (tPass != conPass) {
        fs.readFile(index.dirname + "/views/signup.html", 'utf8', function (err, data) {

          if (err) throw err;

          var $ = cheerio.load(data);

          $('p.warning').text("Passwords doesn't match");
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


var RUser;
// forget password
const forgetPassword = async (req, res) => {
  try {

    fs.readFile(index.dirname + "/views/forget-password.html", 'utf8', function (err, data) {

      if (err) throw err;

      var $ = cheerio.load(data);

      if (RUser == null) {
        $('p.warning').text("OTP Session timeout, Try again");
        $.html();
        res.send($.html());
      }
      else {
        $('div.divID').append('<input id="login__username" type="number" name="id" class="form__input" placeholder=' + RUser.id + ' readonly>');

        $.html();
        res.send($.html());
      }
    });

  } catch (error) {
    res.status(500).send(error.message);
  }
};

// change password
const changePassword = async (req, res) => {
  try {
    const user = await userLoginInfo.findOne({ id: RUser.id });

    var tPass = req.body.password;
    var conPass = req.body.conpassword;

    if (tPass.toString().length < 6) {
      fs.readFile(index.dirname + "/views/forget-password.html", 'utf8', function (err, data) {

        if (err) throw err;

        var $ = cheerio.load(data);

        if (RUser == null) {
          $('p.warning').text("OTP Session timeout, Try again");
          $.html();
          res.send($.html());
        }
        else {
          $('div.divID').append('<input id="login__username" type="number" name="id" class="form__input" placeholder=' + RUser.id + ' readonly>');
          $('p.warning').text("Password can't be less than 6 characters");
          $.html();
          res.send($.html());
        }

      });
    }

    else if (tPass != conPass) {
      fs.readFile(index.dirname + "/views/forget-password.html", 'utf8', function (err, data) {

        if (err) throw err;

        var $ = cheerio.load(data);

        if (RUser == null) {
          $('p.warning').text("OTP Session timeout, Try again");
          $.html();
          res.send($.html());
        }
        else {
          $('div.divID').append('<input id="login__username" type="number" name="id" class="form__input" placeholder=' + RUser.id + ' readonly>');
          $('p.warning').text("Passwords doesn't match");
          $.html();
          res.send($.html());
        }

      });
    }

    else {
      user.password = req.body.password;
      await user.save();
      fs.readFile(index.dirname + "/views/oksignedup.html", 'utf8', function (err, data) {

        if (err) throw err;

        var $ = cheerio.load(data);

        $('h1').text("Password Successfully Changed");
        $.html();
        res.send($.html());
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};


var otp;

// Verify ID with OTP
const verifyIdOtp = async (req, res) => {
  try {
    RUser = await userLoginInfo.findOne({ id: req.body.id });
    const mainUserInfo = await userInfo.findOne({ id: req.body.id });

    if (RUser == null) {
      fs.readFile(index.dirname + "/views/verify-ID-OTP.html", 'utf8', function (err, data) {

        if (err) throw err;

        var $ = cheerio.load(data);

        $('p.warning').text("ID Doesn't Exists");
        $.html();
        res.send($.html());
      });
    }
    else {
      otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
      sendTheMail(mainUserInfo.email, "Binary5: Here is your password reset OTP", "Hi " + mainUserInfo.name + ", your OTP : " + otp);

      fs.readFile(index.dirname + "/views/verify-ID-OTP-2.html", 'utf8', function (err, data) {

        if (err) throw err;

        var $ = cheerio.load(data);

        if (RUser == null) {
          $('p.warning').text("OTP Session timeout, Try again");
          $.html();
          res.send($.html());
        }
        else {
          $('div.divID').append('<input id="login__username" type="number" name="id" class="form__input" placeholder=' + RUser.id + ' readonly>');

          $.html();
          res.send($.html());
        }
      });
    }

  } catch (error) {
    res.status(500).send(error.message);
  }
};


// Final Verify ID with OTP
const finalVerifyIdOtp = async (req, res) => {
  try {
    if (otp != req.body.uotp) {
      fs.readFile(index.dirname + "/views/verify-ID-OTP-2.html", 'utf8', function (err, data) {

        if (err) throw err;

        var $ = cheerio.load(data);

        if (RUser == null) {
          $('p.warning').text("OTP Session timeout, Try again");
          $.html();
          res.send($.html());
        }
        else {
          $('div.divID').append('<input id="login__username" type="number" name="id" class="form__input" placeholder=' + RUser.id + ' readonly>');

          $('p.warning').text("Wrong OTP");

          $.html();
          res.send($.html());
        }
      });
    }
    else {

      if (RUser == null) {
        fs.readFile(index.dirname + "/views/verify-ID-OTP-2.html", 'utf8', function (err, data) {

          if (err) throw err;

          var $ = cheerio.load(data);

          $('div.divID').append('<input id="login__username" type="number" name="id" class="form__input" placeholder=' + RUser.id + ' readonly>');

          $('p.warning').text("OTP Session timeout, Try again");
          $.html();
          res.send($.html());
        });
      }
      else {
        res.redirect("/forget-password");
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};


/*
// delete user
const deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ id: req.params.id });
    res.status(200).json({ message: "user is deleted" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};*/

module.exports = { getAllUsers, createUser, getActiveUser, loadUserProfile, loadClassMates, signOut, getOneClassMate, forgetPassword, verifyIdOtp, finalVerifyIdOtp, changePassword };