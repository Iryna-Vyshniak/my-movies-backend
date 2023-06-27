const express = require('express');
const router = express.Router();

const { schemas } = require('../../models/user');
const { validateBody } = require('../../decorators');

const AuthController = require('../../controllers/auth-controllers');
// or /signup
router.post('/register', validateBody(schemas.registerSchema), AuthController.register);

//  or signin
router.post('/login', validateBody(schemas.loginSchema), AuthController.login);

module.exports = router;
