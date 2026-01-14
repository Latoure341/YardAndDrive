const {registerUser, loginUser} = require('../controllers/userController.js');
const express = require('express');

const router = express.Router();

//routes
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;