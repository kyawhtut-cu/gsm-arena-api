let doGet = (e) => {
  // Instantiate PostRequest
  var request = new Request(null)

  if (e.parameter) {
    request.parameter = e.parameter
  } else {
    request.status = BAD_REQUEST
    request.message = BAD_REQUEST_MESSAGE
    return request.responseWithJson()
  }

  // Building routes
  var route = new Route()

  route.on(`brand-list`, brandListController)

  route.on(`device-list`, deviceListController)

  route.on(`recommended`, recommendedController)

  // Register the route with request
  request.register(route)

  return request.process()
}

let doPost = (e) => {
  // Instantiate PostRequest
  var request = new Request(null)

  if (e.postData && e.postData.contents) {
    request.parameter = JSON.parse(e.postData.contents)
  } else if (e.parameter) {
    request.parameter = e.parameter
  } else {
    request.status = BAD_REQUEST
    request.message = BAD_REQUEST_MESSAGE
    return request.responseWithJson()
  }

  // Building routes
  var route = new Route()

  route.on(`search`, searchController)

  route.on(`device-detail`, deviceDetailController)

  route.on(`device-list-by-brand`, deviceListByBrandController)

  route.on(`compare`, compareDeviceController)

  // Register the route with request
  request.register(route)

  return request.process()
}
