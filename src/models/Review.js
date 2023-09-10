const mongoose = require('mongoose')
const dayjs = require('dayjs')

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Review title is required'],
    maxlength: 100
  },
  content: {
    type: String,
    required: [true, 'Review content is required'],
    maxlength: 500
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: [true, 'Rating is required']
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

// limit rating to one bootcamp per user
ReviewSchema.index({ bootcampId: 1, userId: 1 }, { unique: true })

// get average rating
ReviewSchema.statics.getAverageRating = async function(bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcampId }
    },
    {
      $group: {
        _id: '$bootcampId',
        averageRating: { $avg: '$rating' }
      }
    }
  ])

  try {
    await this.model('Bootcamp').findByIdAndUpdate(
      bootcampId,
      {
        averageRating: obj[0] ? obj[0].averageRating : undefined
      }
    )
  } catch(error) {
    console.error(error)
  }
}

// call getAverageRating after save
ReviewSchema.post('save', async function() {
  await this.constructor.getAverageRating(this.bootcampId)
})

// call getAverageRating before remove
ReviewSchema.post('remove', async function() {
  await this.constructor.getAverageRating(this.bootcampId)
})

module.exports = mongoose.model('Review', ReviewSchema)
