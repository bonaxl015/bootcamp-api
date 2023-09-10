const express = require('express')
const router = express.Router()

// api URl
const {
  BOOTCAMPS_URL,
  COURSES_URL,
  AUTH_URL,
  REVIEW_URL
} = require('../api-url')

// routes
const bootcampsRouter = require('./bootcamps')
const coursesRouter = require('./courses')
const authRouter = require('./auth')
const userRouter = require('./user')
const reviewRouter = require('./reviews')

router.use(BOOTCAMPS_URL, bootcampsRouter)
router.use(COURSES_URL, coursesRouter)
router.use(AUTH_URL, authRouter)
router.use(AUTH_URL, userRouter)
router.use(REVIEW_URL, reviewRouter)

module.exports = router
