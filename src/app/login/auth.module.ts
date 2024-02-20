import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DirectivesModule} from '../shared/directives/directives.module';
import {AuthLogoComponent} from './components/auth-logo/auth-logo.component';
import {ForgotPasswordPageComponent} from './forgot-password-page/forgot-password-page.component';
import {ForgotPasswordComponent} from './components/forgot-password-form/forgot-password.component';
import {LoginService} from './login.service';
import {PageLogoutComponent} from './page-logout/page-logout.component';
import {LoginComponent} from './login-page/login.component';
import {LoginMainComponent} from './components/login-form/login-main.component';
import {SignUpPageComponent} from './sign-up-page/sign-up-page.component';
import {SignUpFormComponent} from './components/sign-up-form/sign-up-form.component';
import {ResetPasswordPageComponent} from './reset-password-page/reset-password-page.component';
import {ResetPasswordComponent} from './components/reset-password-form/reset-password.component';

import {AuthRoutingModule} from './auth-routing.module';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DirectivesModule,
    AuthRoutingModule
  ],
  exports: [RouterModule],
  declarations: [
    AuthLogoComponent,
    ForgotPasswordPageComponent,
    ForgotPasswordComponent,
    LoginComponent,
    PageLogoutComponent,
    LoginMainComponent,
    SignUpPageComponent,
    SignUpFormComponent,
    ResetPasswordPageComponent,
    ResetPasswordComponent
  ],
  providers: [
    LoginService
  ]
})
export class AuthenticationModule {
}
