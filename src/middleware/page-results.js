const { setPaginationData } = require('../utils/returnData')
const errorHandler = require('./error-handler')

// Process request and paginate results
const paginateResults = model => async (request, response, next) => {
  try {
    let query = model.find(response.params)
  
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
    const total = await model.countDocuments()
  
    query = query.skip(startIndex).limit(pageSize)
  
    const results = await query
  
    const returnData = setPaginationData(
      results,
      startIndex,
      endIndex,
      total,
      pageNum,
      pageSize
    )
  
    response.returnData = returnData
    next()
  } catch(error) {
    errorHandler(error, request, response, next)
  }
}

module.exports = paginateResults
