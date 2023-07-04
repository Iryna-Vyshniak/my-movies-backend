const express = require('express');
const router = express.Router();

const { schemas } = require('../../models/user');
const { validateBody } = require('../../decorators');

const AuthController = require('../../controllers/auth-controllers');
const { authenticate } = require('../../middlewares');
// or /signup
router.post('/register', validateBody(schemas.registerSchema), AuthController.register);

// verify
router.get('/verify/:verificationCode', AuthController.verify);
// verify resend if didn`t send email
router.post('/verify', validateBody(schemas.userEmailSchema), AuthController.resendVerify);

//  or signin
router.post('/login', validateBody(schemas.loginSchema), AuthController.login);

router.get('/current', authenticate, AuthController.getCurrent);

router.post('/logout', authenticate, AuthController.logout);

module.exports = router;
