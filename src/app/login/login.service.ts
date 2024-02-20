import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';
import {LoginViewModel} from './models/login-view.model';
import {SignUpViewModel} from './models/sign-up-view.model';
import {LoginResponseModel} from './models/login-response.model';
import {ForgotPasswordViewModel} from './models/forgot-password-view.model';
import {ResetPasswordViewModel} from './models/reset-password-view.model';
import {Observable} from 'rxjs';


@Injectable()
export class LoginService {

  private readonly POST_SIGN_IN: string = '/api/v1/account/signin';
  private readonly POST_SIGN_UP: string = '/api/v1/account/signup';
  private readonly POST_FORGOT_PASSWORD: string = '/api/v1/account/forgot-password';
  private readonly POST_RESET_PASSWORD: string = '/api/v1/account/reset-password';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public signUp(model: SignUpViewModel) {
    return this.httpHelperService.jsonPost<LoginResponseModel>(this.POST_SIGN_UP, model);
  }

  public signIn(model: LoginViewModel): Observable<LoginResponseModel> {
    return this.httpHelperService.jsonPost<LoginResponseModel>(this.POST_SIGN_IN, model);
  }

  public forgotPassword(model: ForgotPasswordViewModel) {
    return this.httpHelperService.jsonPost<any>(this.POST_FORGOT_PASSWORD, model);
  }

  public resetPassword(model: ResetPasswordViewModel, code: string) {
    model.code = code;
    return this.httpHelperService.jsonPost<any>(this.POST_RESET_PASSWORD, model);
  }
}


