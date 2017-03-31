import BaseRouter, { notifyListenersOnStateChange } from './base-router.es';
import { encodeBase64, decodeBase64, parseJson } from './utils.es';

// Private methods
function onStateChange() {
  try {
    notifyListenersOnStateChange.call(this, this.parsePath(window.location.pathname));
  } catch (e) {
    this._options.onRoutingError(e);
  }
}

export default class PathRouter extends BaseRouter {
  constructor(...args) {
    super({ basePath: '/' }, ...args);
  }

  start() {
    if (!this._running) {
      this._running = true;
      window.addEventListener('popstate', onStateChange.bind(this));
      onStateChange.call(this);
    }

    return this;
  }

  stop() {
    if (this._running) {
      window.removeEventListener('popstate', onStateChange.bind(this));
      this._running = false;
    }
  }

  formatPath(state) {
    return this._options.basePath + this.encodeState(state);
  }

  parsePath(path = '/') {
    if (typeof path !== 'string' || path.substr(0, this._options.basePath.length) !== this._options.basePath) {
      return {};
    }

    const encodedState = path.substr(this._options.basePath.length);

    return encodedState ? this.decodeState(encodedState) : '';
  }

  navigate(state) {
    window.history.pushState(state, undefined, this.formatPath(state));
    onStateChange.call(this);
  }
}
