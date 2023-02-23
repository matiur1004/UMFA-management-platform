import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CONFIRM_MODAL_CONFIG } from '@core/config/modal.config';
import { UmfaUtils } from 'app/core/utils/umfa.utils';
import { UserService } from 'app/shared/services';
import { PasswordCheckValidator } from 'app/shared/validators/password-check.validator';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-amr-user-password',
  templateUrl: './amr-user-password.component.html',
  styleUrls: ['./amr-user-password.component.scss']
})
export class AmrUserPasswordComponent implements OnInit {

  form: UntypedFormGroup;
  data: any;
  submitted: boolean = false;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public matDialogRef: MatDialogRef<AmrUserPasswordComponent>,
    private _formBuilder: FormBuilder,
    //private _ztUtils: ZetesUtils,
    @Inject(MAT_DIALOG_DATA) data,
    private _ufUtils: UmfaUtils
  ) { 
    this.data = data;
  }

  ngOnInit() {
    console.log('old password', this.data.currentPassword);
    // Prepare the card form
    this.form = this._formBuilder.group({
      currPwd: [null, [Validators.required, Validators.minLength(3), PasswordCheckValidator(this.data.currentPassword)]],
      newPwd: ['', [Validators.required, Validators.minLength(3)]],
      confPwd: ['', Validators.required]
    });

    if(this.data.detail) {
      this.form.patchValue(this.data.detail);
    }
  }

  close() {
    this.matDialogRef.close();
  }

  submit() {
    this.submitted = true;
    if(this.form.valid) {
      const dialogRef = this._ufUtils.fuseConfirmDialog(
        CONFIRM_MODAL_CONFIG,
        '', 
        `Are you sure you need to change password?`);
      dialogRef.afterClosed().subscribe((result) => {
        if(result == 'confirmed') {
          this.matDialogRef.close(this.form.value);    
        } else {
          this.matDialogRef.close();
        }
      });
    }
    
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

}
