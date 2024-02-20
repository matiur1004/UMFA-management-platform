import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ForgotPasswordPageComponent} from './forgot-password-page/forgot-password-page.component';
import {SignUpPageComponent} from './sign-up-page/sign-up-page.component';
import {LoginComponent} from './login-page/login.component';
import {ResetPasswordPageComponent} from './reset-password-page/reset-password-page.component';
import {PageLogoutComponent} from './page-logout/page-logout.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: PageLogoutComponent},
  {path: 'forgot-password', component: ForgotPasswordPageComponent},
  {path: 'login/reset-password', component: ResetPasswordPageComponent},
  {path: 'sign-up', component: SignUpPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AuthRoutingModule {
}
