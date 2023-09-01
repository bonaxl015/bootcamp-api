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
const routeProtect = require('../../middleware/auth')

router.route('/query').get(getRequestParams, paginateResults(Course), getCourses)
router.route('/create').post(routeProtect, createCourse)
router.route('/edit').post(routeProtect, updateCourse)
router.route('/delete').post(routeProtect, deleteCourse)

module.exports = router
