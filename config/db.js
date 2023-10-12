const mongoose = require('mongoose')

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(
      process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      }
    )
    console.log(`MongoDB Connected: ${connect.connection.host}`.cyan.underline.bold)
  } catch(error) {
    console.error(error.message)
  }
}

// Database connection
const db = mongoose.connection

db.on('error', error => {
  console.error(`MongoDB Error: ${error.message}`)
  process.exit(1)
})

db.on('disconnected', () => {
  console.log('Database disconnected')
  console.log('Reconnecting to database...')
  connectDb()
})

// Gracefully close the MongoDB connection when the app is closed
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed through app termination')
    process.exit(0)
  })
})

module.exports = connectDb
