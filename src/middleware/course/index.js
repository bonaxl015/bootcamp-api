const { requestQueryCheck } = require('../../utils/requestDataChecker')

// Create request parameters for query
const getRequestParams = (request, response, next) => {
  const params = {
    ...(requestQueryCheck(request, 'id') && {
      _id: request.query.id
    }),
    ...(requestQueryCheck(request, 'title') && {
      title: new RegExp(request.query.title, 'i')
    }),
    ...(requestQueryCheck(request, 'bootcampId') && {
      bootcampId: request.query.bootcampId
    })
  }

  response.params = params
  next()
}

module.exports = getRequestParams
