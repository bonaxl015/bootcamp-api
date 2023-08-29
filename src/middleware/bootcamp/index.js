const { requestQueryCheck } = require('../../utils/requestDataChecker')

// Create request parameters for query
const getRequestParams = (request, response, next) => {
  const params = {
    ...(requestQueryCheck(request, 'id') && {
      _id: request.query.id
    }),
    ...(requestQueryCheck(request, 'name') && {
      name: new RegExp(request.query.name, 'i')
    })
  }

  response.params = params
  next()
}

module.exports = getRequestParams
