import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

export class LoginFormModel {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'login-main',
  templateUrl: './login-main.component.html',
  styleUrls: ['./login-main.component.less']
})
export class LoginMainComponent implements OnInit {
  @Output() formSubmit: EventEmitter<{ data: LoginFormModel, targetPage: string }> = new EventEmitter<{ data: LoginFormModel, targetPage: string }>();
  loginForm: FormGroup;

  email: string;
  logoUrl: string = '/api/v1/managment-companies/logo';

  isNavigationForm: boolean = false;

  isSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.initForms();
  }

  initForms() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', Validators.required],
      rememberMe: false
    });
  }

  onOpenHome() {
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      this.formSubmit.emit({
        data: this.loginForm.value,
        targetPage: 'home'
      });
    }
  }

  onContinue() {
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      this.formSubmit.emit({
        data: this.loginForm.value,
        targetPage: 'continue'
      });
    }
  }
}
