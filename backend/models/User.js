const mongoose = require('mongoose');

// [PK] _id
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: ['admin', 'staff'],
    default: 'staff',
  },
});

module.exports = mongoose.model('User', userSchema);
