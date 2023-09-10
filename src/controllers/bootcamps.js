const Bootcamp = require('../models/Bootcamp')
const responseCodes = require('../utils/returnCodes')
const { returnSuccess } = require('../utils/returnData')
const ErrorResponse = require('../utils/errorResponse')
const messages = require('../utils/returnMessage')
const validateFile = require('../utils/fileValidator')
const asyncHandler = require('../middleware/async-handler')
const path = require('path')
const dayjs = require('dayjs')

// @description      Get all bootcamp list
// @route            GET /api/bootcamper/admin/bootcamps/v1/query
const getBootcamps = asyncHandler(async (request, response, next) => {
  response
    .status(responseCodes.SUCCESS)
    .json(returnSuccess(messages.OPERATION_SUCCESS, response.returnData))
})

// @description      Create new bootcamp
// @route            POST /api/bootcamper/admin/bootcamps/v1/create
const createBootcamp = asyncHandler(async (request, response, next) => {
  // add user to request body
  request.body.userId = request.user.id
  request.body.createdBy = request.user.name
  request.body.updatedBy = request.user.name

  // get all bootcamp created by publisher
  const publishedBootcamp = await Bootcamp.find({ userId: request.user.id })

  // limit to 5 bootcamps only
  if (publishedBootcamp?.length >= 6 && request.user.role !== 'admin') {
    return next(new ErrorResponse(
      messages.CREATE_LIMIT_REACHED,
      responseCodes.FAIL_REQUEST
    ))
  }

  const bootcamp = await Bootcamp.create(request.body)
  if (!Object.keys(bootcamp).length) {
    return next(new ErrorResponse(
      messages.UNABLE_PROCESS_REQUEST,
      responseCodes.FAIL_REQUEST
    ))
  }
  response
    .status(responseCodes.SUCCESS)
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

  // add updatedBy and updatedAt to request body
  request.body.updatedBy = request.user.name
  request.body.updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss')

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
      {
        image: file.name,
        updatedBy: request.user.name,
        updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
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
