//  In Lab

const { facultyLogin } = require('../controllers/faculty.controller');

const router = require('express').Router();

router.get("/", facultyLogin);

//router.post("/", facultyPage);

module.exports = router;