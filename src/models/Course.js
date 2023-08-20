const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Course title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Minimum skill is required']
  },
  scholarship: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcampId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  }
})

module.exports = mongoose.model('Course', CourseSchema)
