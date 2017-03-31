import { encodeBase64, decodeBase64, parseJson, notifyListeners } from './utils.es';

// Helper functions
function verifyProtocol(obj) {
  const requiredMethods = [
    'start',
    'stop',
    'navigate',
  ];

  for (let i in requiredMethods) {
    if (!obj[requiredMethods[i]]) {
      throw new Error(`Method "${requiredMethods[i]}" not implemented`);
    }
  }
}

// Private methods
export function notifyListenersOnStateChange(state) {
  if (JSON.stringify(state) !== JSON.stringify(this._currentState)) {
    this._currentState = state;
    notifyListeners(this._navigationListeners, state);
  }
}

// BaseRouter
export default class BaseRouter {
  constructor(...presetsOrOptions) {
    verifyProtocol(this);

    this._options = {
      currentVersion: 0,
      migrateVersion: function () { throw new Error('migrateVersion not implemented'); },
      onRoutingError: (e) => { throw e; },

      serialize: JSON.stringify,
      compress: (data) => data,
      encode: encodeBase64,
      decode: decodeBase64,
      decompress: (data) => data,
      deserialize: parseJson,
    };

    for (let i in presetsOrOptions) {
      this._options = {
        ...this._options,
        ...presetsOrOptions[i],
      };
    }

    this._currentState = {};
    this._running = false;
    this._navigationListeners = [];
  }

  encodeState(state = {}) {
    if (JSON.stringify(state) === '{}') {
      return '';
    } else {
      return this._options.encode(this._options.compress(this._options.serialize(state)));
    }
  }

  decodeState(str = '') {
    if (typeof str !== 'string' || str.length === 0) {
      return {};
    } else {
      return this._options.deserialize(this._options.decompress(this._options.decode(str)));
    }
  }

  isRunning() {
    return this._running;
  }

  getCurrentState() {
    return this._currentState;
  }

  addNavigationListener(callback) {
    this._navigationListeners.push(callback);
    return this;
  }

  removeNavigationListener(callback) {
    const index = this._navigationListeners.indexOf(callback);

    if (index >= 0) {
      this._navigationListeners.splice(callback, 1);
    }
  }
}
