const express = require('express')
const router = express.Router()
const {
  getCourses,
  // createCourse,
  // updateCourse,
  // deleteCourse
} = require('../../controllers/courses')

router.route('/query').get(getCourses)
// router.route('/create').post(createCourse)
// router.route('/edit').post(updateCourse)
// router.route('/delete').post(deleteCourse)

module.exports = router
