const express = require('express')
const router = express.Router()
const {
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  uploadBootcamp
} = require('../../controllers/bootcamps')
const paginateResults = require('../../middleware/page-results')
const getRequestParams = require('../../middleware/bootcamp')
const Bootcamp = require('../../models/Bootcamp')

router.route('/query').get(getRequestParams, paginateResults(Bootcamp), getBootcamps)
router.route('/create').post(createBootcamp)
router.route('/edit').post(updateBootcamp)
router.route('/delete').post(deleteBootcamp)
router.route('/upload').post(uploadBootcamp)

module.exports = router
