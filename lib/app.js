const matchRoute = function (route, req) {
  if (route.method) {
    return route.method === req.method && req.url.match(route.path);
  }
  return true;
};

class App {
  constructor() {
    this.routes = [];
  }
  get(path, handler) {
    this.routes.push({ path, handler, method: 'GET' });
  }
  post(path, handler) {
    this.routes.push({ path, handler, method: 'POST' });
  }
  use(middleware) {
    this.routes.push({ path: '', handler: middleware });
  }
  serve(req, res) {
    const matchingHandlers = this.routes.filter(route =>
      matchRoute(route, req)
    );
    const next = function () {
      const router = matchingHandlers.shift();
      router.handler(req, res, next);
    };
    next();
  }
}

module.exports = { App };
