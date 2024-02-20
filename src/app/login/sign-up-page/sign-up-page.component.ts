import {Component,} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@services';
import {LoginService} from '../login.service';
import {SignUpViewModel} from '../models/sign-up-view.model';
import {SignUpModel} from '../models/sign-up.model';

@Component({
  selector: 'sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.less']
})
export class SignUpPageComponent {
  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  onFormSubmited(ev: SignUpViewModel) {
    const param: SignUpModel = {
      email: ev.email,
      lastName: ev.lastName,
      firstName: ev.firstName,
      password: ev.password,
      rememberMe: ev.rememberMe
    };
    this.loginService.signUp(param).subscribe(response => {
      this.authService.insert(response);
      this.router.navigate(['/tenant']);
    });
  }
}
