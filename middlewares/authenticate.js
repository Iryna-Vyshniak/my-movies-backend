const jwt = require('jsonwebtoken');

const { HttpError } = require('../helpers');

const { User } = require('../models/user');

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  // console.log(authorization); // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTlmZGY0M2JlZDdjODE2Y2U1YTFmNSIsImlhdCI6MTY4Nzg2ODY5MCwiZXhwIjoxNjg4MDQxNDkwfQ.-qY9ioaCOXTI6T_eW-iLM_YPWxzw3i1Z6tFTb9SIxb0

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    next(HttpError(401, 'Not authorized'));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user) {
      next(HttpError(401, 'Not authorized'));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401, 'Not authorized'));
  }
};

module.exports = authenticate;
