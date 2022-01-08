function Route() {
  this.routes = []
}

Route.prototype.on = function (route, callback) {
  this.routes.push({ 'route': route, 'callback': callback })
}

Route.prototype.condition = function (request) {
  return request.parameter.route != null
}

Route.prototype.handle = function (request) {
  for (let index in this.routes) {
    const route = this.routes[index]
    if (request.parameter.route == route.route) {
      return route.callback(request)
    }
  }

  request.status = NOT_FOUND
  request.message = ROUTE_NOT_FOUND
  return request.responseWithJson()
}
