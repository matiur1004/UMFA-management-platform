import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../shared/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PasswordValidationService} from 'app/login/password-validation.service';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less']
})
export class ResetPasswordComponent implements OnInit {

  @Input() userId: string;

  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  formErrors = {
    "password": '',
    "confirmPassword": ''
  }

  validationMessages = {
    "password": {
      "required": "Password is required",
    },
    "confirmPassword": {
      "required": "Confirm password is required",
      "confirmPassword": "Phone number is not in the correct format"
    }
  }
  form: FormGroup;
  isSubmitted: boolean = false;

  constructor(private activeModal: NgbActiveModal, private userService: UserService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {

    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: PasswordValidationService.MatchPassword
    });

    this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
  }

  onReset() {
    this.isSubmitted = true;
    if (!this.form.valid) {
      this.onValueFormChange();
      return;
    }

    this.userService.resetPassword(this.userId, this.form.value).subscribe(response => {
      this.onCancel();
    });

  }

  onCancel() {
    this.activeModal.close(false);
  }

  onValueFormChange(data?: any) {
    if (!this.form) return;
    let form = this.form;

    for (let field in this.formErrors) {
      this.formErrors[field] = "";
      let control = form.get(field);

      if ((control && control.dirty && !control.valid) || (control && this.isSubmitted && !control.valid)) {
        let message = this.validationMessages[field];
        for (let key in control.errors) {
          this.formErrors[field] = message[key];
        }
      }
    }
  }

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPassword() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

}
