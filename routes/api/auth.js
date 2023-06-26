const express = require('express');
const router = express.Router();

const { schemas } = require('../../models/user');
const { validateBody } = require('../../decorators');
// const { isValidId } = require('../../middlewares');
const UserController = require('../../controllers/auth');
// or /signup
router.post('/register', validateBody(schemas.registerSchema), UserController.register);

module.exports = router;
