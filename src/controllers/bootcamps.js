const Bootcamp = require('../models/Bootcamp')
const responseCodes = require('../utils/returnCodes')
const { returnSuccess, setPaginationData } = require('../utils/returnData')
const ErrorResponse = require('../utils/errorResponse')
const messages = require('../utils/returnMessage')
const validateFile = require('../utils/fileValidator')
const asyncHandler = require('../middleware/async-handler')
const { requestQueryCheck } = require('../utils/requestDataChecker')
const path = require('path')

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
// @route            GET /api/bootcamper/admin/bootcamps/v1/query
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
// @route            POST /api/bootcamper/admin/bootcamps/v1/create
const createBootcamp = asyncHandler(async (request, response, next) => {
  const bootcamp = await Bootcamp.create(request.body)
  if (!Object.keys(bootcamp).length) {
    return next(new ErrorResponse(
      messages.UNABLE_PROCESS_REQUEST,
      responseCodes.FAIL_REQUEST
    ))
  }
  response
    .status(responseCodes.CREATED)
    .json(returnSuccess(messages.OPERATION_SUCCESS, null))
})

// @description      Update bootcamp
// @route            POST /api/bootcamper/admin/bootcamps/v1/edit
const updateBootcamp = asyncHandler(async (request, response, next) => {
  if (!request.body.id) {
    return next(new ErrorResponse(
      messages.ID_CANNOT_BE_EMPTY,
      responseCodes.FAIL_REQUEST
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
      responseCodes.FAIL_REQUEST
    ))
  }
  response
    .status(responseCodes.SUCCESS)
    .json(returnSuccess(messages.OPERATION_SUCCESS, null))
})

// @description      Delete bootcamp
// @route            POST /api/bootcamper/admin/bootcamps/v1/delete
const deleteBootcamp = asyncHandler(async (request, response, next) => {
  if (!request.body.id) {
    return next(new ErrorResponse(
      messages.ID_CANNOT_BE_EMPTY,
      responseCodes.FAIL_REQUEST
    ))
  }

  const bootcamp = await Bootcamp.findById(request.body.id)

  if (!bootcamp) {
    return next(new ErrorResponse(
      messages.UNABLE_PROCESS_REQUEST,
      responseCodes.FAIL_REQUEST
    ))
  }

  await bootcamp.remove()

  response
    .status(responseCodes.SUCCESS)
    .json(returnSuccess(messages.OPERATION_SUCCESS, null))
})

// @description      Upload bootcamp image
// @route            POST /api/bootcamper/admin/bootcamps/v1/upload
const uploadBootcamp = asyncHandler(async (request, response, next) => {
  if (!request.body.id) {
    return next(new ErrorResponse(
      messages.ID_CANNOT_BE_EMPTY,
      responseCodes.FAIL_REQUEST
    ))
  }

  const bootcamp = await Bootcamp.findById(request.body.id)

  if (!bootcamp) {
    return next(new ErrorResponse(
      messages.UNABLE_PROCESS_REQUEST,
      responseCodes.FAIL_REQUEST
    ))
  }

  if (!request.files) {
    return next(new ErrorResponse(
      messages.EMPTY_UPLOAD_IMAGE,
      responseCodes.FAIL_REQUEST
    ))
  }

  // get file info
  const file = request.files.files

  // validate file
  const validateResult = validateFile(file, 'image', 1024 * 1024)
  if (validateResult) {
    return next(new ErrorResponse(
      validateResult,
      responseCodes.FAIL_REQUEST
    ))
  }

  // rename file
  file.name = `image_${bootcamp._id}${path.parse(file.name).ext}`

  // move file to public path
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err)
      return next(new ErrorResponse(
        messages.UPLOAD_NOT_SUCCESS,
        responseCodes.FAIL_REQUEST
      ))
    }

    await Bootcamp.findByIdAndUpdate(
      request.body.id,
      { image: file.name }
    )

    response
      .status(responseCodes.SUCCESS)
      .json(returnSuccess(messages.OPERATION_SUCCESS, null))
  })
})

module.exports = {
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  uploadBootcamp
}
