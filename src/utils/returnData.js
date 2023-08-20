const responseCodes = require('./returnCodes')
const messages = require('./returnMessage')
const status = require('./returnStatus')

const returnSuccess = (successMessage = '', data) => ({
  code: responseCodes.OK,
  data,
  error: null,
  message: successMessage,
  status: status.SUCCESS
})

const returnFail = (errorMessage, data, code = null) => ({
  code: code || responseCodes.FAIL_REQUEST,
  data,
  error: errorMessage,
  message: messages.OPERATION_FAILED,
  status: status.FAIL
})

const setPaginationData = (data, start, end, total, pageNum, pageSize) => {
  const count = data.length
  const nextPage = end < total ? pageNum + 1 : null
  const prevPage = start > 0 ? pageNum - 1 : null

  return {
    nextPage,
    prevPage,
    data,
    total,
    count,
    pageNum,
    pageSize
  }
}

module.exports = {
  returnSuccess,
  returnFail,
  setPaginationData
}
