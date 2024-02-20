import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {ForgotPasswordPageComponent} from './forgot-password-page.component';
import {ForgotPasswordComponent} from '../components/forgot-password-form/forgot-password.component';
import {AuthLogoComponent} from '../components/auth-logo/auth-logo.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {LoginService} from '../login.service';

@Injectable()
class LoginMockService {
  login(): any {
    const ob = Observable.create({login: 'admin'});
    return ob;
  }

  signUp() {
    const ob = Observable.create({});
    return ob;
  }
}

describe('ForgotPasswordPageComponent', () => {
  let component: ForgotPasswordPageComponent;
  let fixture: ComponentFixture<ForgotPasswordPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
          {path: '**', redirectTo: '/'}
        ])
      ],
      declarations: [ForgotPasswordPageComponent, ForgotPasswordComponent, AuthLogoComponent],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: LoginService, useClass: LoginMockService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
