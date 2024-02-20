import {Component, HostBinding, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'auth-logo',
  templateUrl: './auth-logo.component.html',
  styleUrls: ['./auth-logo.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AuthLogoComponent {
  @HostBinding('class') classes = 'col-lg-6 d-none d-lg-block auth-right';

  constructor() {
  }
}
