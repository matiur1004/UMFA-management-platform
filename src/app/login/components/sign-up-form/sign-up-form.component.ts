import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SignUpViewModel} from '../../models/sign-up-view.model';
import {PasswordValidationService} from '../../password-validation.service';

@Component({
  selector: 'sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.less']
})
export class SignUpFormComponent implements OnInit {
  @Output() formSubmit: EventEmitter<SignUpViewModel> = new EventEmitter<SignUpViewModel>();
  signUpForm: FormGroup;
  submited = false;

  logoUrl: string = '/api/v1/managment-companies/logo?' + new Date().getTime();

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.signUpForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        rememberMe: false,
        isAccept: [false, Validators.requiredTrue]
      },
      {validator: PasswordValidationService.MatchPassword}
    );
  }

  isInvalid(field: string) {
    return this.submited && this.signUpForm.controls[field].invalid;
  }

  onSignUp() {
    this.submited = true;
    if (this.signUpForm.valid) {
      this.formSubmit.emit(this.signUpForm.value);
    }
  }
}
