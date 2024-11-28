const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Endpoint to get all users (participants)
router.get('/:is', userController.getAllUsers);

module.exports = router;
