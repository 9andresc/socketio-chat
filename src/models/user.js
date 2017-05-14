const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    maxlength: [254, 'Should be equal to or less than 254 characters'],
    required: [true, 'Is required']
  },
  name: {
    type: String,
    maxlength: [40, 'Should be equal to or less than 40 characters'],
    required: [true, 'Is required']
  },
  intention: {
    type: String,
    default: 'buy',
    enum: {
      values: [
        'buy',
        'invest',
        'produce',
        'rent'
      ],
      message: 'Invalid type of intention'
    },
    required: [true, 'Is required']
  }
}, { timestamps: true })

userSchema.index({ email: 'text', name: 'text' })

module.exports = mongoose.model('User', userSchema)
