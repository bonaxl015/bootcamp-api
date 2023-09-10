const express = require('express')
const router = express.Router()
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../../controllers/reviews')
const paginateResults = require('../../middleware/page-results')
const getRequestParams = require('../../middleware/course')
const Review = require('../../models/Review')
const { routeProtect, authorize } = require('../../middleware/auth')

router
  .route('/query')
  .get(
    getRequestParams,
    paginateResults(Review),
    getReviews
  )
router
  .route('/create')
  .post(
    routeProtect,
    authorize('user', 'admin'),
    createReview
  )
router
  .route('/edit')
  .post(
    routeProtect,
    authorize('user', 'admin'),
    updateReview
  )
router
  .route('/delete')
  .post(
    routeProtect,
    authorize('user', 'admin'),
    deleteReview
  )

module.exports = router
