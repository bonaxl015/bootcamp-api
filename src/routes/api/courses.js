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
const { routeProtect, authorize } = require('../../middleware/auth')

router
  .route('/query')
  .get(
    getRequestParams,
    paginateResults(Course),
    getCourses
  )
router
  .route('/create')
  .post(
    routeProtect,
    authorize('publisher', 'admin'),
    createCourse
  )
router
  .route('/edit')
  .post(
    routeProtect,
    authorize('publisher', 'admin'),
    updateCourse
  )
router
  .route('/delete')
  .post(
    routeProtect,
    authorize('publisher', 'admin'),
    deleteCourse
  )

module.exports = router
