import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CONFIRM_MODAL_CONFIG } from '@core/config/modal.config';
import { NotificationType, UserNotification } from '@core/models';
import { UmfaUtils } from '@core/utils/umfa.utils';
import { UserService } from '@shared/services';
import { Subject, takeUntil } from 'rxjs';

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
    private _userService: UserService,
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
        Id: [0],
        NotificationTypeId: [type.Id],
        UserId: this.data.detail.Id,
        Email: [false],
        WhatsApp: [false],
        Telegram: [false]
      }));
    });

    // to get notification types for user
    this._userService.getAllUserNotificationsForUser(this.data.detail.Id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: UserNotification[]) => {
        //this.roles = res;
        console.log('sssss', res);
        res.map(item => {
          let index = this.notificationTypesItems.findIndex(type => type.Id == item.NotificationTypeId);
          this.form.get('NotificationGroup')['controls'][index].patchValue(item);
        })

      })
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

  onChangeNotificationType(index) {
    console.log(this.form.get('NotificationGroup').value[index]);
    this._userService.createOrUpdateUserNotifications(this.form.get('NotificationGroup').value[index])
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {})
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
