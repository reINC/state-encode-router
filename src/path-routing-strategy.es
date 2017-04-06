export default class PathRoutingStrategy {
  constructor({ basePath = '/' }) {
    this._basePath = basePath;
  }

  getRoute() {
    return window.location.pathname || '/';
  }

  setRoute(route) {
    window.history.pushState(route, undefined, route);
    if (this._listener) {
      this._listener();
    }
  }

  routeFromStateString(stateString) {
    return this._basePath + stateString;
  }

  stateStringFromRoute(route) {
    if (typeof route !== 'string' || route.substr(0, this._basePath.length) !== this._basePath) {
      return '';
    }

    return route.substr(this._basePath.length);
  }

  attachNavigationListener(listener) {
    this._listener = listener;
    window.addEventListener('popstate', listener);
  }

  detachNavigationListener(listener) {
    window.removeEventListener('popstate', listener);
    delete this._listener;
  }
}
