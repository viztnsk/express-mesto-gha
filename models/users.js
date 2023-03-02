/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, `Минимальное количество символов - 2, введено - ${VALUE}`],
    maxlength: [2, `Максимальное количество символов - 30, введено - ${VALUE}`],
  },
  about: {
    type: String,
    required: true,
    minlength: [2, `Минимальное количество символов - 2, введено - ${VALUE}`],
    maxlength: [30, `Максимальное количество символов - 30, введено - ${VALUE}`],
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
