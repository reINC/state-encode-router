export default class HashRoutingStrategy {
  getRoute() {
    return window.location.hash || '#';
  }

  setRoute(route) {
    window.location.hash = route;
  }

  routeFromStateString(stateString) {
    return '#' + stateString;
  }

  stateStringFromRoute(route) {
    if (typeof route !== 'string') {
      return '';
    }

    return /^#?(.*)$/.exec(route)[1];
  }

  attachNavigationListener(listener) {
    window.addEventListener('popstate', listener);
    window.addEventListener('hashchange', listener);
  }

  detachNavigationListener(listener) {
    window.removeEventListener('popstate', listener);
    window.removeEventListener('hashchange', listener);
  }
}
