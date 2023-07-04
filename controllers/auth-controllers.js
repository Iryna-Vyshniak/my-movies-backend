const bcrypt = require('bcryptjs');
// for token
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');

const { User } = require('../models/user');

const { HttpError, sendEmail } = require('../helpers');

const { ctrlWrapper } = require('../decorators');

const { SECRET_KEY, BASE_URL } = process.env;

/* const createHashPassword = async (password) => {
  hash password

  1variant - use salt
  salt - набір випадкових символів
   const salt = await bcrypt.genSalt(10);
  console.log(salt); // $2a$10$UwlcqnKsUVeHPAs0UEk6gO
  const result = await bcrypt.hash(password, salt);

  2variant - use more simple algorithm
  const result = await bcrypt.hash(password, 10);
  console.log(result);

  порівнюємо, щоб потім при повторному вказуванні пароля вже введений пароль був розпізнаний, хоча вже захешований - тобто чи є result захешованою версією password, якщо є - повертає true : false
  
  const compareResult1 = await bcrypt.compare(password, result);
};
createHashPassword('123456'); // $2a$10$.lP9p8ZsxNGhLWBUuETIX.XoUUAypKOB7cKt9W65zN0cjco0LVwAa */

/* створюємо payload - інформація про користувача, яку ми зберігаємо, зазвичай використовуємо id користувача

const payload = {
  id: '6499c95345f7c4192e9f6ee0',
};

expiresIn - час життя токену

const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
console.log('TOKEN', token); => TOKEN eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTljOTUzNDVmN2M0MTkyZTlmNmVlMCIsImlhdCI6MTY4NzgwNjMxNSwiZXhwIjoxNjg3ODg5MTE1fQ.yNwb0aPgmZajGjpn81H0aSRqjj72PYCU2zrFxQo_KO8

const decodeToken = jwt.decode(token);

id  - id - payload - user
iat - час створення токену
exp - час завершення
console.log('deTOKEN', decodeToken); => { id: '6499c95345f7c4192e9f6ee0', iat: 1687806295, exp: 1687889095 }

перевіряємо чи валідний токен, чи шифрували його саме за допомогою цього секретного ключа і чи не закінчився термін дії - повертає payload або викидає помилку
try {
  const { id } = jwt.verify(token, SECRET_KEY);
  console.log(id);
  const invalidToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OTljOTUzNDVmN2M0MTkyZTlmNmVlMCIsImlhdCI6MTY4NzgwNzMzNywiZXhwIjoxNjg3ODkwMTM3fQ.C1hC4nSV8DFD7LES_JYh_KuVdabZkT4wMkSuzbVIl3E';

  const result = jwt.verify(invalidToken, SECRET_KEY);
} catch (error) {
  console.log(error.message);
} */

const register = async (req, res) => {
  const { email, password } = req.body;
  //   findOne - перше співпадіння
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Email already exist');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationCode = randomUUID();

  const newUser = await User.create({ ...req.body, password: hashPassword, verificationCode });

  const verifyEmail = {
    // тому, хто щойно зареєструвався
    to: email,
    subject: 'Verify email',
    // лінк на наш роут на бекенді, який перевіряє, чи є такий email
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  // add token
  const { _id: id } = newUser;

  const payload = {
    id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2 days' });
  res.status(201).json({
    token,
    user: { name: newUser.name, email: newUser.email },
  });
};

// verify email

const verify = async (req, res) => {
  const { verificationCode } = req.params;
  // перевіряємо чи є такий користувач в базі
  const user = await User.findOne({ verificationCode });

  if (!user) {
    throw HttpError(401);
  }

  await User.findByIdAndUpdate(user._id, { verify: true, verificationCode: '' });

  res.json({
    message: 'Verification Email Success',
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  // перевіряємо чи є такий користувач в базі
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401);
  }
  if (user.verify) {
    throw HttpError(400, 'Email already verify');
  }

  const verifyEmail = {
    // тому, хто щойно зареєструвався
    to: email,
    subject: 'Verify email',
    // лінк на наш роут на бекенді, який перевіряє, чи є такий email
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: 'Verify email send success',
  });
};

// signin
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log(user);

  // 401 - не авторизований
  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }
  if (!user.verify) {
    throw HttpError(401, 'Not verify email');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password invalid');
  }

  //   const { _id: id } = user;
  //   console.log(user);

  const payload = {
    id: user._id,
  };

  // console.log(payload);

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2 days' });
  // console.log(token);
  await User.findByIdAndUpdate(user._id, { token });

  // refactor
  res.json({
    token,
    user: { name: user.name, email: user.email },
  });
};

//  GET http://localhost:3000/api/auth/current
const getCurrent = async (req, res) => {
  const { token, name, email } = req.user;

  res.json({
    token,
    user: { name, email },
  });
};

// POST http://localhost:3000/api/auth/logout
const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: '' });

  res.json({ message: 'Logout success' });
};

module.exports = {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
};
