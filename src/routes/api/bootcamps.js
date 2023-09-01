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
const routeProtect = require('../../middleware/auth')

router.route('/query').get(getRequestParams, paginateResults(Bootcamp), getBootcamps)
router.route('/create').post(routeProtect, createBootcamp)
router.route('/edit').post(routeProtect, updateBootcamp)
router.route('/delete').post(routeProtect, deleteBootcamp)
router.route('/upload').post(routeProtect, uploadBootcamp)

module.exports = router
