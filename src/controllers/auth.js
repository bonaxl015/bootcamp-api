const User = require('../models/User')
const responseCodes = require('../utils/returnCodes')
const { returnSuccess } = require('../utils/returnData')
const asyncHandler = require('../middleware/async-handler')
const ErrorResponse = require('../utils/errorResponse')
const messages = require('../utils/returnMessage')
const { sendEmail } = require('../utils/sendEmail')
const { MAIN_PREFIX_URL, AUTH_URL } = require('../routes/api-url')
const crypto = require('crypto')

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

// @description      forgot password
// @route            POST /api/bootcamper/admin/auth/v1/forgotPassword
const forgotPassword = asyncHandler(async (request, response, next) => {
  const { email } = request.body

  if (!email) {
    return next(new ErrorResponse(
      messages.EMAIL_CANNOT_BE_EMPTY,
      responseCodes.FAIL_REQUEST
    ))
  }

  const user = await User.findOne({ email })

  if (!user) {
    return next(new ErrorResponse(
      messages.USER_NOT_FOUND,
      responseCodes.FAIL_REQUEST
    ))
  }

  // get reset token
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  // create reset url
  const resetUrl =
    `${request.protocol}://${request.get('host')}${MAIN_PREFIX_URL}${AUTH_URL}/resetPassword/${resetToken}`
  const message = `Please click this link to reset your password ${resetUrl}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset Your Password',
      message
    })

    response
      .status(responseCodes.SUCCESS)
      .json(returnSuccess(messages.OPERATION_SUCCESS, null))
  } catch (error) {
    console.error(error)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })
    return next(new ErrorResponse(
      messages.UNABLE_PROCESS_REQUEST,
      responseCodes.FAIL_REQUEST
    ))
  }
})

// @description      reset password
// @route            POST /api/bootcamper/admin/auth/v1/resetPassword/:resetToken
const resetPassword = asyncHandler(async (request, response, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(request.params.resetToken)
    .digest('hex')
  
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })

  if (!user) {
    return next(new ErrorResponse(
      messages.INVALID_TOKEN,
      responseCodes.FAIL_REQUEST
    ))
  }

  // set new password
  user.password = request.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

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

module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
  forgotPassword,
  resetPassword
}
