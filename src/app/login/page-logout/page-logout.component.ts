import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@services';
import {LoginFormModel} from '@app/login/components/login-form/login-main.component';
import {Store} from '@ngrx/store';
import {logoutAction} from '@app/app.reducer';

@Component({
  selector: 'app-logout',
  templateUrl: './page-logout.component.html',
  styleUrls: ['./page-logout.component.less']
})
export class PageLogoutComponent implements OnInit {
  constructor(
    private router: Router,
    private store: Store,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.authService.reset();
    this.store.dispatch(logoutAction());
    this.router.navigate(['/login'], {replaceUrl: true});
  }

  onSubmitForm($event: { data: LoginFormModel; targetPage: string }) {

  }
}
