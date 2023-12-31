const mongoose = require('mongoose')
const { emailPattern } = require('../utils/patterns')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dayjs = require('dayjs')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    match: [emailPattern, 'Email is invalid']
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: String,
    default: dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  updatedAt: {
    type: String,
    default: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
})

// Encrypt password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Match password to encrypted password
UserSchema.methods.matchPassword = async function(enterPassword) {
  return await bcrypt.compare(enterPassword, this.password)
}

// Sign jwt and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  )
}

// Get reset password token
UserSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex')
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000
  return resetToken
}

module.exports = mongoose.model('User', UserSchema)
 