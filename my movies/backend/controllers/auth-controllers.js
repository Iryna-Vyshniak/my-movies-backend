const bcrypt = require('bcryptjs');
// for token
const jwt = require('jsonwebtoken');

const { User } = require('../models/user');

const { HttpError } = require('../helpers');

const { ctrlWrapper } = require('../decorators');

const { SECRET_KEY } = process.env;

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

  const newUser = await User.create({ ...req.body, password: hashPassword });

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

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log(user);

  // 401 - не авторизований
  if (!user) {
    throw HttpError(401, 'Email or password invalid');
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
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
};
