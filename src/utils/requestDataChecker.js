const requestQueryCheck = (request, key) => {
  return Boolean(request?.query?.[key])
}

module.exports = {
  requestQueryCheck
}
