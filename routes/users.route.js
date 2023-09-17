const { getAllUsers, signOut, loadClassMates, loadUserProfile, forgetPassword, verifyIdOtp , finalVerifyIdOtp, changePassword } = require('../controllers/users.controller');
const { createNewUser } = require('../controllers/userInfo.controller');

const router = require('express').Router();

router.post("/newuser", createNewUser);

router.get("/profile", loadUserProfile);

router.get("/classmates", loadClassMates);

router.get("/signout", signOut);

router.post("/verify-ID-OTP", verifyIdOtp);

router.post("/verify-ID-OTP-2", finalVerifyIdOtp);

router.get("/forget-password", forgetPassword);

router.post("/forget-password", changePassword);

router.post("/", getAllUsers);

module.exports = router;