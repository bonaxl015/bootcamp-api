const mongoose = require('mongoose')
const dayjs = require('dayjs')

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
    type: String,
    default: dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  createdBy: {
    type: String,
    required: [true, 'createdBy cannot be empty']
  },
  updatedAt: {
    type: String,
    default: dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  updatedBy: {
    type: String,
    required: [true, 'updatedBy cannot be empty']
  },
  bootcampId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = mongoose.model('Course', CourseSchema)
