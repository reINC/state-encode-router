import HashRoutingStrategy from './hash-routing-strategy.es';


// Versioning

export const currentVersion = 0;

export function migrateVersion() {
  throw new Error('migrateVersion not implemented');
}


// Processing

export function serialize(obj) {
  return JSON.stringify(obj);
}

export function compress(data) {
  return data;
}

export function encode(str) {
  return btoa(str).replace(/=/g, '~').replace(/\+/g, '-').replace(/\//g, '_');
}

export const routingStrategy = new HashRoutingStrategy();

export function decode(str) {
  return atob(str.replace(/~/g, '=').replace(/-/g, '+').replace(/_/g, '/'));
}

export function decompress(data) {
  return data;
}

export function deserialize(str) {
  return str.trim().length > 0 ? JSON.parse(str) : '';
}

export function onRoutingError(e) {
  throw e;
}
