import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../login.service';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.less']
})
export class ResetPasswordPageComponent implements OnInit {
  code: string;
  public isCreate: string;
  public email: string;

  public hasBeenReseted = false;

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {
  }

  ngOnInit() {
    this.router.routerState.root.queryParams.subscribe(params => {
      this.code = params['code'];
      this.isCreate = params['create'];
      this.email = params['email'];
    });
  }

  onSubmitForm(ev: any) {
    this.loginService.resetPassword(ev, this.code).subscribe(response => {
      this.hasBeenReseted = true;
    });
  }
}
