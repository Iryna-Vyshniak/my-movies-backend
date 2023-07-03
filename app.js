const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const ElasticEmail = require('@elasticemail/elasticemail-client');
require('dotenv').config();

const { ELASTICEMAIL_API_KEY } = process.env;
const defaultClient = ElasticEmail.ApiClient.instance;

const { apikey } = defaultClient.authentications;
apikey.apiKey = ELASTICEMAIL_API_KEY;

const api = new ElasticEmail.EmailsApi();

const email = ElasticEmail.EmailMessageData.constructFromObject({
  // той, кому відправляємо email
  Recipients: [new ElasticEmail.EmailRecipient('tarzucogna@gufum.com')],
  Content: {
    Body: [
      ElasticEmail.BodyPart.constructFromObject({
        ContentType: 'HTML',
        Content: '<p>Verify email</p>',
      }),
    ],
    Subject: 'Verify email',
    From: 'irinavn2011@gmail.com',
  },
});

const callback = function (error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
api.emailsPost(email, callback);

// import auth router
const authRouter = require('./routes/api/auth-router');
const moviesRouter = require('./routes/api/movies-router');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// add router for auth
app.use('/api/auth', authRouter);
app.use('/api/movies', moviesRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
