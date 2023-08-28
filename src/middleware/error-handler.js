const responseCodes = require('../utils/returnCodes')
const { returnFail } = require('../utils/returnData')
const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (error, request, response, next) => {
  let errorData = { ...error }
  errorData.message = error.message

  console.log(error)

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    const message = 'Data not found'
    errorData = new ErrorResponse(message, responseCodes.FAIL_REQUEST)
  }

  // Mongoose duplicate data
  if (error.code === responseCodes.DUPLICATE_DATA) {
    const message = 'Data already in use. Please try another one.'
    errorData = new ErrorResponse(message, responseCodes.DUPLICATE_DATA)
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map(item => item.message)
    console.log(message)
    errorData = new ErrorResponse(message, responseCodes.FAIL_REQUEST)
  }

  response
    .status(responseCodes.SUCCESS)
    .json(returnFail(
      errorData.message,
      null,
      errorData.statusCode || responseCodes.FAIL_REQUEST
    ))
}

module.exports = errorHandler
