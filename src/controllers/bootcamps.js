const Bootcamp = require('../models/Bootcamp')
const responseCodes = require('../utils/returnCodes')
const { returnSuccess, setPaginationData } = require('../utils/returnData')
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
    ...(requestQueryCheck(request, 'name') && {
      name: new RegExp(request.query.name, 'i')
    })
  }
  return params
}

// @description      Get all bootcamp list
// @route            GET /api/v1/bootcamps/query
const getBootcamps = asyncHandler(async (request, response, next) => {
  const params = getRequestParams(request)

  let query = Bootcamp.find(params)

  // Select
  if (request.query.select) {
    const fields = request.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  // Sort
  if (request.query.sort) {
    const sortBy = request.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Pagination
  const pageNum = Number(request.query.pageNum, 10) || 1
  const pageSize = Number(request.query.pageSize, 10) || 10
  const startIndex = (pageNum - 1) * pageSize
  const endIndex = pageNum * pageSize
  const total = await Bootcamp.countDocuments()

  query = query.skip(startIndex).limit(pageSize)

  const bootcamps = await query

  const returnData = setPaginationData(
    bootcamps,
    startIndex,
    endIndex,
    total,
    pageNum,
    pageSize
  )

  response
    .status(responseCodes.SUCCESS)
    .json(returnSuccess(messages.OPERATION_SUCCESS, returnData))
})

// @description      Create new bootcamp
// @route            POST /api/v1/bootcamps/create
const createBootcamp = asyncHandler(async (request, response, next) => {
  const bootcamp = await Bootcamp.create(request.body)
  if (!Object.keys(bootcamp).length) {
    return next(new ErrorResponse(
      messages.UNABLE_PROCESS_REQUEST,
      responseCodes.BAD_REQUEST
    ))
  }
  response
    .status(responseCodes.CREATED)
    .json(returnSuccess(messages.OPERATION_SUCCESS, null))
})

// @description      Update bootcamp
// @route            POST /api/v1/bootcamps/edit
const updateBootcamp = asyncHandler(async (request, response, next) => {
  if (!request.body.id) {
    return next(new ErrorResponse(
      messages.ID_CANNOT_BE_EMPTY,
      responseCodes.BAD_REQUEST
    ))
  }

  const bootcamp = await Bootcamp.findByIdAndUpdate(
    request.body.id,
    request.body,
    { new: true, runValidators: true }
  )

  if (!bootcamp) {
    return next(new ErrorResponse(
      messages.UNABLE_PROCESS_REQUEST,
      responseCodes.BAD_REQUEST
    ))
  }
  response
    .status(responseCodes.SUCCESS)
    .json(returnSuccess(messages.OPERATION_SUCCESS, null))
})

// @description      Delete bootcamp
// @route            POST /api/v1/bootcamps/delete
const deleteBootcamp = asyncHandler(async (request, response, next) => {
  if (!request.body.id) {
    return next(new ErrorResponse(
      messages.ID_CANNOT_BE_EMPTY,
      responseCodes.BAD_REQUEST
    ))
  }

  const bootcamp = await Bootcamp.findByIdAndDelete(request.body.id)

  if (!bootcamp) {
    return next(new ErrorResponse(
      messages.UNABLE_PROCESS_REQUEST,
      responseCodes.BAD_REQUEST
    ))
  }
  response
    .status(responseCodes.SUCCESS)
    .json(returnSuccess(messages.OPERATION_SUCCESS, null))
})

module.exports = {
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp
}
