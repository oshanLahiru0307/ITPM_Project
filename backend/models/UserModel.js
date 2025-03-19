const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({

  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    default: null
  }
}, { timestamps: true })

module.exports = mongoose.model('newUser', UserSchema)