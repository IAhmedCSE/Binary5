// In Lab


const admin = require("../models/admin.model");
const index = require('../index');
const cheerio = require('cheerio');
const fs = require('fs');


// Faculty Login
const facultyLogin = async (req, res) => {
    res.send("Hello Sir");
};

module.exports = { facultyLogin };