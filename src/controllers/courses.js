const Course = require('../models/Course')
const responseCodes = require('../utils/returnCodes')
const { returnSuccess } = require('../utils/returnData')
const ErrorResponse = require('../utils/errorResponse')
const messages = require('../utils/returnMessage')
const asyncHandler = require('../middleware/async-handler')
const { requestQueryCheck } = require('../utils/requestDataChecker')

// @description      Create request parameters for query
const getRequestParams = request => {
  const params = {
    ...(requestQueryCheck(request, 'id') && {
      _id: request.query.id
    }),
    ...(requestQueryCheck(request, 'title') && {
      title: new RegExp(request.query.title, 'i')
    }),
    ...(requestQueryCheck(request, 'bootcampId') && {
      bootcampId: request.query.bootcampId
    })
  }
  return params
}

// @description      Get all courses
// @route            GET /api/v1/courses
const getCourses = asyncHandler(async (request, response, next) => {
  if (!request.query.bootcampId) {
    return next(new ErrorResponse(
      messages.ID_CANNOT_BE_EMPTY,
      responseCodes.BAD_REQUEST
    ))
  }

  const params = getRequestParams(request)

  let query = Course.find(params)

  const courses = await query

  response
    .status(responseCodes.SUCCESS)
    .json(returnSuccess(messages.OPERATION_SUCCESS, courses))
})

module.exports = {
  getCourses
}
