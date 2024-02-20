import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../login.service';
import {AuthService, BranchManagerService} from '@services';
import {LoginResponseModel} from '../models/login-response.model';
import {LoginFormModel} from '../components/login-form/login-main.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {
  constructor(
    private router: Router,
    private loginService: LoginService,
    private branchManager: BranchManagerService,
    private authService: AuthService) {
  }

  redirectRelativeToTargetHome(response) {
    this.branchManager.getAllBranches(response.lastBranchId);
    if (response.isTenantUser) {
      this.router.navigate(['/tenant']);
    } else if (response.isClientUser) {
      this.router.navigate(['/client']);
    } else {
      this.router.navigate(['/admin']);
    }
  }

  redirectRelativeToTargetContinue(response) {
    this.branchManager.getAllBranches(response.lastBranchId);
    this.router.navigate(['/']);
  }

  onSubmitForm(ev: { data: LoginFormModel, targetPage: string }) {
    const data: LoginFormModel = ev.data;
    this.loginService.signIn(data).subscribe((response: LoginResponseModel) => {
      this.authService.insert(response);

      if (ev.targetPage === 'home') {
        this.redirectRelativeToTargetHome(response);
      } else {
        this.redirectRelativeToTargetContinue(response);
      }
    });
  }
}
