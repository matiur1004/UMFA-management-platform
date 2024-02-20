import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ForgotPasswordViewModel} from '../../models/forgot-password-view.model';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {
  @Output() formSubmit: EventEmitter<ForgotPasswordViewModel> = new EventEmitter<ForgotPasswordViewModel>();
  forgotForm: FormGroup;
  submited = false;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onForgotPasswordSubmit() {
    this.submited = true;
    if (this.forgotForm.valid) {
      this.formSubmit.emit(this.forgotForm.value);
    }
  }

  onLogin() {

  }
}
