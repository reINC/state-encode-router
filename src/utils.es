export function encodeBase64(str) {
  return btoa(str).replace(/=/g, '~').replace(/\+/g, '-').replace(/\//g, '_');
}

export function decodeBase64(str) {
  return atob(str.replace(/~/g, '=').replace(/-/g, '+').replace(/_/g, '/'));
}

export function parseJson(str) {
  return str.trim().length > 0 ? JSON.parse(str) : '';
}

export function notifyListeners(listeners, state) {
  for(let i in listeners) {
    listeners[i](state);
  }
}
