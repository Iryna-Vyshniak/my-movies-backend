const express = require('express');
const router = express.Router();

const { schemas } = require('../../models/user');
const { validateBody } = require('../../decorators');

const AuthController = require('../../controllers/auth-controllers');
const { authenticate } = require('../../middlewares');
// or /signup
router.post('/register', validateBody(schemas.registerSchema), AuthController.register);

//  or signin
router.post('/login', validateBody(schemas.loginSchema), AuthController.login);

router.get('/current', authenticate, AuthController.getCurrent);

router.post('/logout', authenticate, AuthController.logout);

module.exports = router;
