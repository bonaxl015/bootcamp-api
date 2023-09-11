const express = require('express')
const dotenv = require('dotenv')
const connectDb = require('./config/db')
const expressFileUpload = require('express-fileupload')
const colors = require('colors')
const errorHandler = require('./src/middleware/error-handler')
const path = require('path')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xssClean = require('xss-clean')

// Route files
const { MAIN_PREFIX_URL } = require('./src/routes/api-url')
const mainRoute = require('./src/routes/api')

// Load env variables
dotenv.config({ path: './config/config.env' })

// Connect to database
connectDb()

const app = express()

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent cross site scripting attacks
app.use(xssClean())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// File uploader middleware
app.use(expressFileUpload())

// Mount routers
app.use(MAIN_PREFIX_URL, mainRoute)

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`.blue.underline.bold)
)

// Handle unhandled promise rejection
process.on('unHandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold)
  server.close(() => process.exit(1))
})
