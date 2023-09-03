const jwt = require('jsonwebtoken')
const asyncHandler = require('./async-handler')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const message = require('../utils/returnMessage')
const responseCodes = require('../utils/returnCodes')

// Protect other routes
const routeProtect = asyncHandler(async (request, response, next) => {
  let token

  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith('Bearer')
  ) {
    token = request.headers.authorization.split(' ')[1]
  }

  if(!token) {
    return next(new ErrorResponse(
      message.NOT_AUTHORIZED,
      responseCodes.FAIL_REQUEST
    ))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    request.user = await User.findById(decoded.id)
    next()
  } catch(error) {
    return next(new ErrorResponse(
      message.NOT_AUTHORIZED,
      responseCodes.UNAUTHORIZED
    ))
  }
})

// Access authorization
const authorize = (...roles) => {
  return (request, response, next) => {
    if (!roles.includes(request.user.role)) {
      return next(new ErrorResponse(
        message.NO_PERMISSION,
        responseCodes.FORBIDDEN
      ))
    }
    next()
  }
}

module.exports = {
  routeProtect,
  authorize
}
