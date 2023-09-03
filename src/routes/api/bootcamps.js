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
const { routeProtect, authorize } = require('../../middleware/auth')

router
  .route('/query')
  .get(
    getRequestParams,
    paginateResults(Bootcamp),
    getBootcamps
  )
router
  .route('/create')
  .post(
    routeProtect,
    authorize('publisher', 'admin'),
    createBootcamp
  )
router
  .route('/edit')
  .post(
    routeProtect,
    authorize('publisher', 'admin'),
    updateBootcamp
  )
router
  .route('/delete')
  .post(
    routeProtect,
    authorize('publisher', 'admin'),
    deleteBootcamp
  )
router
  .route('/upload')
  .post(
    routeProtect,
    authorize('publisher', 'admin'),
    uploadBootcamp
  )

module.exports = router
