const express = require('express')
const router = express.Router()
const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../../controllers/courses')
const paginateResults = require('../../middleware/page-results')
const getRequestParams = require('../../middleware/course')
const Course = require('../../models/Course')

router.route('/query').get(getRequestParams, paginateResults(Course), getCourses)
router.route('/create').post(createCourse)
router.route('/edit').post(updateCourse)
router.route('/delete').post(deleteCourse)

module.exports = router
