import BaseRouter from './base-router.es';
import { encodeBase64, decodeBase64, parseJson, notifyListeners } from './utils.es';

// Private methods
function onStateChange() {
  const state = this.parseHash(window.location.hash);

  if (JSON.stringify(state) !== JSON.stringify(this._currentState)) {
    this._currentState = state;
    notifyListeners(this._navigationListeners, state);
  }
}

export default class HashRouter extends BaseRouter {
  constructor(...args) {
    super(...args);
  }

  start() {
    if (!this._running) {
      this._running = true;
      window.addEventListener('popstate', onStateChange.bind(this));
      window.addEventListener('hashchange', onStateChange.bind(this));

      onStateChange.call(this);
    }

    return this;
  }

  stop() {
    if (this._running) {
      window.removeEventListener('popstate', onStateChange.bind(this));
      window.removeEventListener('hashchange', onStateChange.bind(this));
      this._running = false;
    }
  }

  formatHash(state) {
    return '#' + this.encodeState(state);
  }

  parseHash(hash = '#') {
    if (typeof hash !== 'string' || hash === '' || hash === '#') {
      return {};
    }

    const encodedState = /^#?(.*)$/.exec(hash)[1];

    return encodedState ? this.decodeState(encodedState) : '';
  }

  navigate(state) {
    window.location.hash = this.formatHash(state);
  }
}