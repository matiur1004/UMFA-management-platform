import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';

import {SignUpFormComponent} from './sign-up-form.component';
import {LoginService} from '../../login.service';

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

describe('SignUpFormComponent', () => {
  let component: SignUpFormComponent;
  let fixture: ComponentFixture<SignUpFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
          {path: '**', redirectTo: '/'}
        ])
      ],
      declarations: [SignUpFormComponent],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: LoginService, useClass: LoginMockService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
