const { getAllUsers, signOut, loadClassMates, loadUserProfile } = require('../controllers/users.controller');
const { createNewUser } = require('../controllers/userInfo.controller');

const router = require('express').Router();

router.post("/newuser", createNewUser);

router.get("/profile", loadUserProfile);

router.get("/classmates", loadClassMates);

router.get("/signout", signOut);

router.post("/", getAllUsers);

module.exports = router;