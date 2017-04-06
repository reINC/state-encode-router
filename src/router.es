import * as presetDefault from './preset-default.es';


// Helper functions

function mergeOptions(presetsOrOptions) {
  let options = { ...presetDefault };

  for (let i in presetsOrOptions) {
    options = {
      ...options,
      ...presetsOrOptions[i],
    };
  }

  return options;
}


// Private methods

function updateState() {
  try {
    const listeners = this._stateChangeListeners;
    const state = this.parseRoute();

    if (JSON.stringify(state) !== JSON.stringify(this._currentState)) {
      this._currentState = state;

      for(let i in listeners) {
        listeners[i](state);
      }
    }
  } catch (e) {
    this._options.onRoutingError(e);
  }
}


// Router

export default class Router {
  constructor(...presetsOrOptions) {
    this._options = mergeOptions(presetsOrOptions);

    this._running = false;
    this._currentState = {};
    this._navigationListener = updateState.bind(this);
    this._stateChangeListeners = [];
  }

  formatString(state = {}) {
    if (JSON.stringify(state) === '{}') {
      return '';
    } else {
      return this._options.encode(this._options.compress(this._options.serialize(state)));
    }
  }

  parseString(str = '') {
    if (typeof str !== 'string' || str.length === 0) {
      return {};
    } else {
      return this._options.deserialize(this._options.decompress(this._options.decode(str)));
    }
  }

  formatRoute(state = {}) {
    return this._options.routingStrategy.routeFromStateString(this.formatString(state));
  }

  parseRoute(route = this._options.routingStrategy.getRoute()) {
    return this.parseString(this._options.routingStrategy.stateStringFromRoute(route));
  }

  isRunning() {
    return this._running;
  }

  start() {
    if (!this._running) {
      this._running = true;
      this._options.routingStrategy.attachNavigationListener(this._navigationListener);
      this._navigationListener();
    }

    return this;
  }

  stop() {
    if (this._running) {
      this._options.routingStrategy.detachNavigationListener(this._navigationListener);
      this._running = false;
    }
  }

  getCurrentState() {
    return this._currentState;
  }

  addStateChangeListener(callback) {
    this._stateChangeListeners.push(callback);
    return this;
  }

  removeStateChangeListener(callback) {
    const index = this._stateChangeListeners.indexOf(callback);

    if (index >= 0) {
      this._stateChangeListeners.splice(callback, 1);
    }
  }

  navigate(state) {
    this._options.routingStrategy.setRoute(this.formatRoute(state));
  }
}
