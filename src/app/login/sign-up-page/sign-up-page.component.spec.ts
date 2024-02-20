import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {SignUpPageComponent} from './sign-up-page.component';
import {SignUpFormComponent} from '../components/sign-up-form/sign-up-form.component';
import {AuthLogoComponent} from '../components/auth-logo/auth-logo.component';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {LoginService} from '../login.service';
import {AuthService} from '@services';

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

@Injectable()

class AuthMockService {
  insert(): any {
  }
}

describe('SignUpPageComponent', () => {
  let component: SignUpPageComponent;
  let fixture: ComponentFixture<SignUpPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
          {path: '**', redirectTo: '/'}
        ])
      ],
      declarations: [AuthLogoComponent, SignUpPageComponent, SignUpFormComponent],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: LoginService, useClass: LoginMockService},
        {provide: AuthService, useClass: AuthMockService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
