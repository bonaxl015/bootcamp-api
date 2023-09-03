const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

// Load env variables
dotenv.config({ path: './config/config.env' })

// Load models
const Bootcamp = require('./src/models/Bootcamp')
const Course = require('./src/models/Course')
const User = require('./src/models/User')

// Connect to database
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
)

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(
    `${__dirname}/_data/bootcamps.json`,
    'utf-8'
  )
)
const courses = JSON.parse(
  fs.readFileSync(
    `${__dirname}/_data/courses.json`,
    'utf-8'
  )
)
const users = JSON.parse(
  fs.readFileSync(
    `${__dirname}/_data/users.json`,
    'utf-8'
  )
)

// Import into database
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    await Course.create(courses)
    await User.create(users)
    console.log('Data imported successfully'.green.inverse)
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany()
    await Course.deleteMany()
    await User.deleteMany()
    console.log('Data deleted successfully'.red.inverse)
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

if (process.argv[2] === '-import') importData()
if (process.argv[2] === '-delete') deleteData()
