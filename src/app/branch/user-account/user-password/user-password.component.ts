import {Component, OnInit} from '@angular/core';
import {UserAccountService} from 'app/shared/services/user-account.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserAccountChangePasswordViewModel} from '../../../shared/models/user-account-change-password.model';
import {Location} from '@angular/common';

@Component({
  selector: 'user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.less']
})
export class UserPasswordComponent implements OnInit {

  isSubmitted: boolean = false;
  form: FormGroup;

  formErrors = {
    "oldPassword": '',
    "newPassword": '',
    "newPasswordConfirm": '',
  }

  validationMessages = {
    "oldPassword": {
      "required": "Old password is required",
    },
    "newPassword": {
      "required": "New password is required",
    },
    "newPasswordConfirm": {
      "required": "New password confirm is required",
    },
  }

  isOldPasswordVisible: boolean = false;
  isNewPasswordVisible: boolean = false;
  isNewPasswordConfirmVisible: boolean = false;

  constructor(private userAccountService: UserAccountService, private fb: FormBuilder, private location: Location) {
  }

  ngOnInit() {
    this.createForm({oldPassword: '', newPassword: '', newPasswordConfirm: ''});
  }


  createForm(model: UserAccountChangePasswordViewModel) {
    this.form = this.fb.group({
      oldPassword: [model.oldPassword, Validators.required],
      newPassword: [model.newPassword, Validators.required],
      newPasswordConfirm: [model.newPasswordConfirm, Validators.required],
    });

    this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
  }

  save() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      this.onValueFormChange();
      return;
    }

    this.userAccountService.changePassword(this.form.value).subscribe(response => {
      this.location.back();
    });
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

  toggleOldPassword() {
    this.isOldPasswordVisible = !this.isOldPasswordVisible;
  }

  toggleNewPassword() {
    this.isNewPasswordVisible = !this.isNewPasswordVisible;
  }

  toggleNewPasswordConfirm() {
    this.isNewPasswordConfirmVisible = !this.isNewPasswordConfirmVisible;
  }
}
