import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PasswordValidationService} from '../../password-validation.service';
import {ResetPasswordViewModel} from '../../models/reset-password-view.model';

@Component({
  selector: 'reset-password-form',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  @Input('isCreate') isCreate: boolean = false;
  @Output() formSubmit: EventEmitter<ResetPasswordViewModel> = new EventEmitter<ResetPasswordViewModel>();
  resetForm: FormGroup;
  submited = false;

  constructor(private fb: FormBuilder) {
  }

  private _email: string;

  @Input('email') set email(value: string) {
    this._email = value;
    this.createForm();
  };

  createForm() {
    this.resetForm = this.fb.group({
      email: [this._email, Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: PasswordValidationService.MatchPassword
    });
  }

  onResetPasswordSubmit() {
    this.submited = true;
    if (this.resetForm.valid) {
      this.formSubmit.emit(this.resetForm.value);
    }
  }
}
