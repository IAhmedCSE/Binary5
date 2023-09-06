const { getAllUsers, createUser, updateUser, deleteUser, loadHome } = require('../controllers/users.controller');
const { createNewUser } = require('../controllers/userInfo.controller');

const router = require('express').Router();

router.post("/newuser", createNewUser);

//router.get("/home", loadHome);

router.post("/", getAllUsers);

//router.patch("/:id", updateUser);

//router.delete("/:id", deleteUser);

module.exports = router;