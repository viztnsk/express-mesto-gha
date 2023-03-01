/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const userData = ((req, res, next) => {
  req.user = {
    _id: '63fc8142644d9558616a80aa',
  };
  next();
});

app.use(userData);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
