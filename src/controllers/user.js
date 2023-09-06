const User = require('../models/User')
const responseCodes = require('../utils/returnCodes')
const { returnSuccess } = require('../utils/returnData')
const asyncHandler = require('../middleware/async-handler')
const ErrorResponse = require('../utils/errorResponse')
const messages = require('../utils/returnMessage')
const dayjs = require('dayjs')

// @description      get all users
// @route            GET /api/bootcamper/admin/auth/v1/getUser
const getAllUsers = asyncHandler(async (request, response, next) => {
  response
    .status(responseCodes.SUCCESS)
    .json(returnSuccess(messages.OPERATION_SUCCESS, response.returnData))
})

// @description      Create new user
// @route            POST /api/bootcamper/admin/auth/v1/createUser
const createUser = asyncHandler(async (request, response, next) => {
  const user = await User.create(request.body)

  if(!Object.keys(user).length) {
    return next(new ErrorResponse(
      messages.UNABLE_PROCESS_REQUEST,
      responseCodes.FAIL_REQUEST
    ))
  }

  response
    .status(responseCodes.SUCCESS)
    .json(returnSuccess(messages.OPERATION_SUCCESS, null))
})

// @description      update user
// @route            POST /api/bootcamper/admin/auth/v1/updateUser
const updateUser = asyncHandler(async (request, response, next) => {
  if(!request.body.id) {
    return next(new ErrorResponse(
      messages.ID_CANNOT_BE_EMPTY,
      responseCodes.FAIL_REQUEST
    ))
  }

  request.body.updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const user = await User.findByIdAndUpdate(
    request.body.id,
    request.body,
    {
      new: true,
      runValidators: true
    }
  )

  if(!Object.keys(user).length) {
    return next(new ErrorResponse(
      messages.UNABLE_PROCESS_REQUEST,
      responseCodes.FAIL_REQUEST
    ))
  }

  response
    .status(responseCodes.SUCCESS)
    .json(returnSuccess(messages.OPERATION_SUCCESS, null))
})

// @description      delete user
// @route            POST /api/bootcamper/admin/auth/v1/deleteUser
const deleteUser = asyncHandler(async (request, response, next) => {
  if(!request.body.id) {
    return next(new ErrorResponse(
      messages.ID_CANNOT_BE_EMPTY,
      responseCodes.FAIL_REQUEST
    ))
  }

  const user = await User.findByIdAndDelete(request.body.id)

  if(!user) {
    return next(new ErrorResponse(
      messages.UNABLE_PROCESS_REQUEST,
      responseCodes.FAIL_REQUEST
    ))
  }

  response
    .status(responseCodes.SUCCESS)
    .json(returnSuccess(messages.OPERATION_SUCCESS, null))
})

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
}