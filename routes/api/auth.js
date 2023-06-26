const express = require('express');
const router = express.Router();

const { schemas } = require('../../models/user');
const { validateBody } = require('../../decorators');

const UserController = require('../../controllers/auth');
// or /signup
router.post('/register', validateBody(schemas.registerSchema), UserController.register);

//  or signin
router.post('/login', validateBody(schemas.loginSchema), UserController.login);

module.exports = router;
