import {LoginViewModel} from './login-view.model';

export interface SignUpViewModel extends LoginViewModel {
  firstName: string;
  lastName: string;
}
