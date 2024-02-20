import {Injectable} from '@angular/core';

function _window() {
  return window
}

@Injectable()
export class WindowRef {

  constructor() {
  }

  getWindow(): any {
    return _window();
  }
}
