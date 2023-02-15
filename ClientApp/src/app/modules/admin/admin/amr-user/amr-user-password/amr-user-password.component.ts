import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';

function pwdMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const newPwd = c.get('newPwd');
  const confPwd = c.get('confPwd');

  if (newPwd.pristine || confPwd.pristine) return null;

  if (newPwd.value === confPwd.value) return null;

  return { match: true };
}

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
    private _formBuilder: UntypedFormBuilder,
    //private _ztUtils: ZetesUtils,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.data = data;
  }

  ngOnInit(): void {
    // Prepare the card form
    this.form = this._formBuilder.group({
      currPwd: [null, [Validators.required, Validators.minLength(3)]],
      pwdGroup: this._formBuilder.group({
        newPwd: ['', [Validators.required, Validators.minLength(3)]],
        confPwd: ['', Validators.required],
      }, { validator: pwdMatcher }),
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
      // const dialogRef = this._ztUtils.fuseConfirmDialog(
      //   CONFIRM_MODAL_CONFIG,
      //   '', 
      //   `Are you sure you need to ${this.data.detail ? 'update' : 'create'}?`);
      // dialogRef.afterClosed().subscribe((result) => {
      //   if(result == 'confirmed') {
      //     this.matDialogRef.close(this.form.value);    
      //   } else {
      //     this.matDialogRef.close();
      //   }
      // });
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
