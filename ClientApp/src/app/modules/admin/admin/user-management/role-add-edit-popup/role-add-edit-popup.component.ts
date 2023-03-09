import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CONFIRM_MODAL_CONFIG } from '@core/config/modal.config';
import { NotificationType } from '@core/models';
import { UmfaUtils } from '@core/utils/umfa.utils';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-role-add-edit-popup',
  templateUrl: './role-add-edit-popup.component.html',
  styleUrls: ['./role-add-edit-popup.component.scss']
})
export class RoleAddEditPopupComponent implements OnInit {

  form: UntypedFormGroup;
  data: any;
  roleItems = [];
  notificationTypesItems: NotificationType[] = [];
  submitted: boolean = false;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public matDialogRef: MatDialogRef<RoleAddEditPopupComponent>,
    private _formBuilder: UntypedFormBuilder,
    private _ufUtils: UmfaUtils,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.data = data;
  }

  ngOnInit(): void {
    // Prepare the card form
    this.form = this._formBuilder.group({
      RoleId: [null, Validators.required],
      NotificationEmailAddress: ['', [Validators.email]],
      NotificationMobileNumber: [''],
      NotificationGroup: this._formBuilder.array([])
    });

    this.roleItems = this.data['roleItems'];
    this.notificationTypesItems = this.data['notificationTypeItems'];
    const checkArray = <FormArray>this.form.get('NotificationGroup');
    this.notificationTypesItems.forEach(type => {
      checkArray.push(this._formBuilder.group({
        NotificationTypeId: [type.Id],
        Email: [false],
        WhatsApp: [false],
        Telegram: [false]
      }));
    });
    if(this.data.detail) {
      this.form.patchValue(this.data.detail);
    }

  }

  get notificationGroup(): FormArray {
    return this.form.controls.NotificationGroup as FormArray;
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
        `Are you sure you need to ${this.data.detail ? 'update' : 'create'}?`);
      // Subscribe to afterClosed from the dialog reference
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
