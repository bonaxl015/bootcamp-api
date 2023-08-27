const express = require('express')
const router = express.Router()

// api URl
const {
  BOOTCAMPS_URL,
  COURSES_URL
} = require('../api-url')

// routes
const bootcampsRouter = require('./bootcamps')
const coursesRouter = require('./courses')

router.use(BOOTCAMPS_URL, bootcampsRouter)
router.use(COURSES_URL, coursesRouter)

module.exports = router
