const bcrypt = require('bcryptjs');
const { User } = require('../models/user');

const { HttpError } = require('../helpers');

const { ctrlWrapper } = require('../decorators');

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

const register = async (req, res) => {
  const { email, password } = req.body;
  //   findOne - перше співпадіння
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

module.exports = {
  register: ctrlWrapper(register),
};
