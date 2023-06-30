const multer = require('multer');
const path = require('path');

const { HttpError } = require('../helpers');

// path resolve дописує шлях до корню проєкту
const destination = path.resolve('temp');

const storage = multer.diskStorage({
  //   destination: destination,
  destination,
  // зберігаємо файл,який отримуємо, під іншим ім'ям завдяки ф-ції filename (ex: same name)
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const newName = `${uniquePrefix}_${file.originalname}`;
    cb(null, newName);
  },
});

// 1mb = 1024 * 1024
const limits = {
  fileSize: 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
  const { mimetype } = file;
  console.log(mimetype);
  if (mimetype !== 'image/jpeg' || mimetype !== 'image/png') {
    cb(HttpError(400, 'File can have only .jpg or .png extension'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

module.exports = upload;
