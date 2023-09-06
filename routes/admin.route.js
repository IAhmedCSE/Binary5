const { adminLogin, adminPage } = require('../controllers/admin.controller');

const router = require('express').Router();

router.post("/", adminLogin);

router.get("/", adminPage);

module.exports = router;