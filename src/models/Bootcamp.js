const mongoose = require('mongoose')
const { urlPattern, emailPattern } = require('../utils/patterns')
const slugify = require('slugify')

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  website: {
    type: String,
    match: [urlPattern, 'Website is invalid']
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number cannot be more than 20 characters']
  },
  email: {
    type: String,
    match: [emailPattern, 'Email is invalid']
  },
  address: {
    type: String,
    required: [true, 'Address cannot be empty']
  },
  careers: {
    type: [String],
    required: [true, 'Career is required'],
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Others'
    ]
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating cannot be more than 10']
  },
  price: Number,
  image: {
    type: String,
    default: 'no-image.jpg'
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGcash: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Create bootcamp slug from the name
BootcampSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// Remove courses under specified bootcampId
BootcampSchema.pre('remove', async function(next) {
  await this.model('Course').deleteMany({ bootcampId: this._id })
  next()
})

module.exports = mongoose.model('Bootcamp', BootcampSchema)
