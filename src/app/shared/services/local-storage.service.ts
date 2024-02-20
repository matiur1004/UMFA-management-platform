import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  get(key: string) {
    return localStorage.getItem(`dunamis_${key}`);
  }

  set(key: string, value) {
    localStorage.setItem(`dunamis_${key}`, value);
  }

  clearAll() {
    localStorage.clear();
  }

  remove(key: string) {
    localStorage.removeItem(`dunamis_${key}`);
  }

  keys() {
    const keys = [...Array(localStorage.length)].map((o, i) => {
      return localStorage.key(i);
    })
    return keys;
  }
}
