const User = require('../models/User')
const responseCodes = require('../utils/returnCodes')
const { returnSuccess } = require('../utils/returnData')
const asyncHandler = require('../middleware/async-handler')
const ErrorResponse = require('../utils/errorResponse')
const messages = require('../utils/returnMessage')

// @description      Register a new user
// @route            POST /api/bootcamper/admin/auth/v1/register
const registerUser = asyncHandler(async (request, response, next) => {
  const { name, email, password, role } = request.body
  const user = await User.create({
    name,
    email,
    password,
    role
  })

  sendTokenResponse(user, responseCodes.SUCCESS, response)
})

// @description      Login user
// @route            POST /api/bootcamper/admin/auth/v1/login
const loginUser = asyncHandler(async (request, response, next) => {
  const { email, password } = request.body

  if (!email) {
    return next(new ErrorResponse(
      messages.EMAIL_CANNOT_BE_EMPTY,
      responseCodes.FAIL_REQUEST
    ))
  }

  if (!password) {
    return next(new ErrorResponse(
      messages.PASSWORD_CANNOT_BE_EMPTY,
      responseCodes.FAIL_REQUEST
    ))
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorResponse(
      messages.INVALID_CREDENTIALS,
      responseCodes.FAIL_REQUEST
    ))
  }

  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse(
      messages.PASSWORD_NOT_MATCH,
      responseCodes.FAIL_REQUEST
    ))
  }

  sendTokenResponse(user, responseCodes.SUCCESS, response)
})

// get token and create cookie
const sendTokenResponse = (user, statusCode, response) => {
  // create token
  const token = user.getSignedJwtToken()
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  response
    .status(statusCode)
    .cookie('token', token, options)
    .json(returnSuccess(messages.OPERATION_SUCCESS, token))
}

// @description      Get current user information
// @route            POST /api/bootcamper/admin/auth/v1/getUserInfo
const getUserInfo = asyncHandler(async (request, response, next) => {
  const { id } = request.user

  if (!id) {
    return next(new ErrorResponse(
      messages.ID_CANNOT_BE_EMPTY,
      responseCodes.FAIL_REQUEST
    ))
  }

  const userInfo = await User.findById(id)

  response
    .status(responseCodes.SUCCESS)
    .json(returnSuccess(messages.OPERATION_SUCCESS, userInfo))
})

module.exports = {
  registerUser,
  loginUser,
  getUserInfo
}
