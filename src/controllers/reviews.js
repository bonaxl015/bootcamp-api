const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamp')
const responseCodes = require('../utils/returnCodes')
const { returnSuccess } = require('../utils/returnData')
const ErrorResponse = require('../utils/errorResponse')
const messages = require('../utils/returnMessage')
const asyncHandler = require('../middleware/async-handler')
const dayjs = require('dayjs')

// @description      Get all reviews by bootcampId
// @route            GET /api/bootcamper/admin/reviews/v1/query
const getReviews = asyncHandler(async (request, response, next) => {
  if (!request.query.bootcampId) {
    return next(new ErrorResponse(
      messages.ID_CANNOT_BE_EMPTY,
      responseCodes.FAIL_REQUEST
    ))
  } else {
    response
      .status(responseCodes.SUCCESS)
      .json(returnSuccess(messages.OPERATION_SUCCESS, response.returnData))
  }
})

// @description      Create review under given bootcampId
// @route            POST /api/bootcamper/admin/reviews/v1/create
const createReview  = asyncHandler(async (request, response, next) => {
  if (!request.body.bootcampId) {
    return next(new ErrorResponse(
      messages.ID_CANNOT_BE_EMPTY,
      responseCodes.FAIL_REQUEST
    ))
  }

  const bootcamp = await Bootcamp.findById(request.body.bootcampId)

  if (!bootcamp) {
    return next(new ErrorResponse(
      messages.INVALID_ID,
      responseCodes.FAIL_REQUEST
    ))
  }

  // add user to request body
  request.body.userId = request.user.id
  request.body.createdBy = request.user.name
  request.body.updatedBy = request.user.name
  
  const newReview = await Review.create(request.body)
  if (!Object.keys(newReview).length) {
    return next(new ErrorResponse(
      messages.UNABLE_PROCESS_REQUEST,
      responseCodes.FAIL_REQUEST
    ))
  }
  response
    .status(responseCodes.SUCCESS)
    .json(returnSuccess(messages.OPERATION_SUCCESS, null))
})

// @description      Edit review under given bootcampId
// @route            POST /api/bootcamper/admin/reviews/v1/edit
const updateReview = asyncHandler(async (request, response, next) => {
  if (!request.body.bootcampId || !request.body.id) {
    return next(new ErrorResponse(
      messages.ID_CANNOT_BE_EMPTY,
      responseCodes.FAIL_REQUEST
    ))
  }

  const bootcamp = await Bootcamp.findById(request.body.bootcampId)

  if (!bootcamp) {
    return next(new ErrorResponse(
      messages.INVALID_ID,
      responseCodes.FAIL_REQUEST
    ))
  }

  // add updatedBy and updatedAt to request body
  request.body.updatedBy = request.user.name
  request.body.updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss')

  const updateReview = await Review.findByIdAndUpdate(
    request.body.id,
    request.body,
    { new: true, runValidators: true }
  )
  if (!updateReview) {
    return next(new ErrorResponse(
      messages.UNABLE_PROCESS_REQUEST,
      responseCodes.FAIL_REQUEST
    ))
  }
  response
    .status(responseCodes.SUCCESS)
    .json(returnSuccess(messages.OPERATION_SUCCESS, null))
})

// @description      Delete review under given bootcampId
// @route            POST /api/bootcamper/admin/reviews/v1/delete
const deleteReview = asyncHandler(async (request, response, next) => {
  if (!request.body.id) {
    return next(new ErrorResponse(
      messages.ID_CANNOT_BE_EMPTY,
      responseCodes.FAIL_REQUEST
    ))
  }

  const review = await Review.findById(request.body.id)

  if (!review) {
    return next(new ErrorResponse(
      messages.UNABLE_PROCESS_REQUEST,
      responseCodes.FAIL_REQUEST
    ))
  }

  await review.remove()

  response
    .status(responseCodes.SUCCESS)
    .json(returnSuccess(messages.OPERATION_SUCCESS, null))
})

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview
}