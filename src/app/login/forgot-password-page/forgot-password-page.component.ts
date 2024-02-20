import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../login.service';

@Component({
  selector: 'forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.less']
})
export class ForgotPasswordPageComponent {

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {
  }

  onFormSubmitted(ev) {
    this.loginService.forgotPassword(ev).subscribe(response => {
      this.router.navigate(['/login']);
    });
  }
}
