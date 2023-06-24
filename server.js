const mongoose = require('mongoose');
const app = require('./app');

const DB_HOST =
  'mongodb+srv://irinavn2011:zu4Qk0j46iwYLfuZ@cluster0.nznhepm.mongodb.net/my_movies?retryWrites=true&w=majority';

mongoose
  .connect(DB_HOST)
  .then(() => app.listen(3000))
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

// zu4Qk0j46iwYLfuZ
// app.listen(3000, () => {
//   console.log('Server running. Use our API on port: 3000');
// });
