const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')
const responseCodes = require('../utils/returnCodes')
const { returnSuccess } = require('../utils/returnData')
const ErrorResponse = require('../utils/errorResponse')
const messages = require('../utils/returnMessage')
const asyncHandler = require('../middleware/async-handler')

// @description      Get all courses by bootcampId
// @route            GET /api/bootcamper/admin/courses/v1/query
const getCourses = asyncHandler(async (request, response, next) => {
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

// @description      Create new course under given bootcampId
// @route            POST /api/bootcamper/admin/courses/v1/create
const createCourse = asyncHandler(async (request, response, next) => {
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

  const newCourse = await Course.create(request.body)
  if (!Object.keys(newCourse).length) {
    return next(new ErrorResponse(
      messages.UNABLE_PROCESS_REQUEST,
      responseCodes.FAIL_REQUEST
    ))
  }
  response
    .status(responseCodes.CREATED)
    .json(returnSuccess(messages.OPERATION_SUCCESS, null))
})

// @description      Edit course under given bootcampId
// @route            POST /api/bootcamper/admin/courses/v1/edit
const updateCourse = asyncHandler(async (request, response, next) => {
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

  const updateCourse = await Course.findByIdAndUpdate(
    request.body.id,
    request.body,
    { new: true, runValidators: true }
  )
  if (!updateCourse) {
    return next(new ErrorResponse(
      messages.UNABLE_PROCESS_REQUEST,
      responseCodes.FAIL_REQUEST
    ))
  }
  response
    .status(responseCodes.CREATED)
    .json(returnSuccess(messages.OPERATION_SUCCESS, null))
})

// @description      Delete course under given bootcampId
// @route            POST /api/bootcamper/admin/courses/v1/delete
const deleteCourse = asyncHandler(async (request, response, next) => {
  if (!request.body.id) {
    return next(new ErrorResponse(
      messages.ID_CANNOT_BE_EMPTY,
      responseCodes.FAIL_REQUEST
    ))
  }

  const course = await Course.findById(request.body.id)

  if (!course) {
    return next(new ErrorResponse(
      messages.UNABLE_PROCESS_REQUEST,
      responseCodes.FAIL_REQUEST
    ))
  }

  await course.remove()

  response
    .status(responseCodes.SUCCESS)
    .json(returnSuccess(messages.OPERATION_SUCCESS, null))
})

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse
}
