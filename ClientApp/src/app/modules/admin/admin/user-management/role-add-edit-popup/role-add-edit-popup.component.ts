import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CONFIRM_MODAL_CONFIG } from '@core/config/modal.config';
import { IUmfaBuilding, NotificationType, UserNotification } from '@core/models';
import { UmfaUtils } from '@core/utils/umfa.utils';
import { UserService } from '@shared/services';
import { UserNotificationScheduleService } from '@shared/services/user-notification-schedule.service';
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
  buildings: IUmfaBuilding[];
  senderTypes: any[];
  summaryTypes: any[];
  selectedBuildingId: number;
  allUserNotificationSchedules: any[] = [];

  dayOfWeeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public matDialogRef: MatDialogRef<RoleAddEditPopupComponent>,
    private _formBuilder: UntypedFormBuilder,
    private _ufUtils: UmfaUtils,
    private _userService: UserService,
    private _userNotificationScheduleService: UserNotificationScheduleService,
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
      BuildingId: [null],
      NotificationGroup: this._formBuilder.array([]),
      Additional: this._formBuilder.array([])
    });

    this.roleItems = this.data['roleItems'];
    this.notificationTypesItems = this.data['notificationTypeItems'];
    this.buildings = this.data['buildings'];
    this.senderTypes = this.data['senderTypes'];
    this.summaryTypes = this.data['summaryTypes'];
    console.log(this.summaryTypes);
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

    // additional notification
    let summaryTypesControls = {};
    this.summaryTypes.forEach(item => {
      if(item.Name == 'End Of Day') summaryTypesControls[item.Id] = [true];
      else summaryTypesControls[item.Id] = [false];
    })

    const additionalArray = <FormArray>this.form.get('Additional');
    this.senderTypes.forEach(type => {
      additionalArray.push(this._formBuilder.group({
        NotificationSenderTypeId: [type.Id],
        DayOfWeek: this._formBuilder.group({
          Monday: [true],
          Tuesday: [true],
          Wednesday: [true],
          Thursday: [true],  
          Friday: [true],
          Saturday: [false],
          Sunday: [false],
        }),
        Hours: this._formBuilder.group({
          Start: [new Date().setHours(7, 0, 0)],
          End: [new Date().setHours(17, 0, 0)]
        }),
        Summary: this._formBuilder.group(summaryTypesControls)
      }))
    })
    // to get notification types for user
    this._userService.getAllUserNotificationsForUser(this.data.detail.Id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: UserNotification[]) => {
        res.map(item => {
          let index = this.notificationTypesItems.findIndex(type => type.Id == item.NotificationTypeId);
          this.form.get('NotificationGroup')['controls'][index].patchValue(item);
        })
      })

    this._userNotificationScheduleService.getAllForUser(this.data.detail.Id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any[]) => {
        this.allUserNotificationSchedules = res;
      })
    if(this.data.detail) {
      this.form.patchValue(this.data.detail);
    }

  }

  get notificationGroup(): FormArray {
    return this.form.controls.NotificationGroup as FormArray;
  }

  get additionalNotifications(): FormArray {
    return this.form.controls.Additional as FormArray;
  }

  getSummaryTypeControl(index, Id) {
    return this.form.get('Additional')['controls'][index].get('Summary')['controls'][Id];
  }

  getDayOfWeekControl(index, day) {
    return this.form.get('Additional')['controls'][index].get('DayOfWeek')['controls'][day];
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
    this._userService.createOrUpdateUserNotifications(this.form.get('NotificationGroup').value[index])
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {
        this.form.get('NotificationGroup')['controls'][index].patchValue(res);
      })
  }

  onChangeBuildingNotificationSchedule(index) {
    console.log(this.form.get('Additional').value[index]);
    let formData = this.transformNotificationSchedule(this.form.get('Additional').value[index]);
    console.log('formData', formData);
  }

  transformNotificationSchedule(data) {
    let result = {};
    result['BuildingId'] = this.form.get('BuildingId').value;
    result['StartTime'] = new Date(data['Hours']['Start']).getHours() + ':00';
    result['EndTime'] = new Date(data['Hours']['End']).getHours() + ':00';
    result['NotificationSenderTypeId'] = data['NotificationSenderTypeId'];
    result['Monday'] = data['DayOfWeek']['Monday'];
    result['Tuesday'] = data['DayOfWeek']['Tuesday'];
    result['Wednesday'] = data['DayOfWeek']['Wednesday'];
    result['Thursday'] = data['DayOfWeek']['Thursday'];
    result['Friday'] = data['DayOfWeek']['Friday'];
    result['Saturday'] = data['DayOfWeek']['Saturday'];
    result['Sunday'] = data['DayOfWeek']['Sunday'];

    Object.keys(data['Summary']).forEach(key => {
      if(data['Summary'][key] == true) result['UserNotificationSummaryTypeId'] = key;
    })
    return result;
  }

  selectionChanged(e: any) {
    this.selectedBuildingId = e.BuildingId;
    let notificationSchedule = this.allUserNotificationSchedules.filter(item => item.BuildingId == e.BuildingId);
    if(notificationSchedule) {
      
    }
    //this.selectedBuildingId = e.BuildingId;
    //this.getMappedMetersForBuilding(e.BuildingId)
  }
  
  customBuildingSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.Name.toLocaleLowerCase().startsWith(term);
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
