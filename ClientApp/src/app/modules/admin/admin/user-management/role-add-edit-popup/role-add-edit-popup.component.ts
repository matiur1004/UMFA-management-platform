import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CONFIRM_MODAL_CONFIG } from '@core/config/modal.config';
import { IUmfaBuilding, NotificationType, UserNotification } from '@core/models';
import { UmfaUtils } from '@core/utils/umfa.utils';
import { NotificationService, UserService } from '@shared/services';
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
  selectedNotificationTab = 0;
  userSettingUpdated: boolean = false;
  userNotificationUpdated: boolean = false;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public matDialogRef: MatDialogRef<RoleAddEditPopupComponent>,
    private _formBuilder: UntypedFormBuilder,
    private _ufUtils: UmfaUtils,
    private _userService: UserService,
    private _userNotificationScheduleService: UserNotificationScheduleService,
    private notificationService: NotificationService,
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

    // to initialize default Form
    this.onInitForm();
    
    // to get notification types for user
    this._userService.getAllUserNotificationsForUser(this.data.detail.Id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: UserNotification[]) => {
        res.map(item => {
          let index = this.notificationTypesItems.findIndex(type => type.Id == item.NotificationTypeId);
          this.form.get('NotificationGroup')['controls'][index].patchValue(item);
        })
      })

    this.getUserNotificationSchedules();
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

  getUserNotificationSchedules() {
    this._userNotificationScheduleService.getAllForUser(this.data.detail.Id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any[]) => {
        this.allUserNotificationSchedules = res;
      })
  }

  onInitForm() {
    // additional notification
    let summaryTypesControls = {};
    this.summaryTypes.forEach(item => {
      if(item.Name == 'End Of Day') summaryTypesControls[item.Id] = [true];
      else summaryTypesControls[item.Id] = [false];
    })

    let additionalArray = <FormArray>this.form.get('Additional');
    while (0 !== additionalArray.length) {
      additionalArray.removeAt(0);
    }
    this.senderTypes.forEach(type => {
      additionalArray.push(this._formBuilder.group({
        Id: [0],
        NotificationSendTypeId: [type.Id],
        UserId: [this.data.detail.Id],
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
        let data = {...this.form.value, UserId: this.data.detail.Id};
        this._userService.onUpdatePortalUserRole(data)
          .subscribe(() => {
            //this.notificationService.message('Updated successfuly!');
            this.userSettingUpdated = true;
          });
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
    let formData = this.transformNotificationSchedule(this.form.get('Additional').value[index]);
    this._userNotificationScheduleService.createOrUpdate(formData)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((res: any) => {
      this.getUserNotificationSchedules();
      this.form.get('Additional')['controls'][index].get("Id").setValue(res['Id']);
      //this.notificationService.message('Updated successfuly!');
      this.userNotificationUpdated = true;
    })
  }

  onChangeBuildingNotificationScheduleFromSummaryType(index, Id) {
    let summaryValue = this.form.get('Additional').value[index]['Summary'];
    Object.keys(summaryValue).forEach(key => {
      if(key == Id) summaryValue[key] = true;
      else summaryValue[key] = false;
    })
    this.form.get('Additional')['controls'][index].get('Summary').setValue(summaryValue);
  }

  transformNotificationSchedule(data) {
    let result = {};
    result['Id'] = data['Id'];
    result['BuildingId'] = this.form.get('BuildingId').value;
    result['StartTime'] = new Date(data['Hours']['Start']).getHours().toString().padStart(2, '0') + ':' + new Date(data['Hours']['Start']).getMinutes().toString().padEnd(2, '0');
    result['EndTime'] = new Date(data['Hours']['End']).getHours().toString().padStart(2, '0') + ':' + new Date(data['Hours']['End']).getMinutes().toString().padEnd(2, '0');
    result['NotificationSendTypeId'] = data['NotificationSendTypeId'];
    result['UserId'] = data['UserId'];
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
    this.selectedNotificationTab = 0;
    this.onInitForm();
    let notificationSchedule = this.allUserNotificationSchedules.filter(item => item.BuildingId == e.BuildingId);
    if(notificationSchedule) {
      notificationSchedule.forEach(obj => {
        this.initNotificationSchedule(obj);
      });
    }
  }
  
  initNotificationSchedule(formData) {    
    let sendTypeId = formData['NotificationSendTypeId'];
    let sendTypeIdx = this.senderTypes.findIndex(item => item.Id == Number(sendTypeId));
    this.form.get('Additional')['controls'][sendTypeIdx].get("DayOfWeek").patchValue({
      Monday: formData['Monday'],
      Tuesday: formData['Tuesday'],
      Wednesday: formData['Wednesday'],
      Thursday: formData['Thursday'],
      Friday: formData['Friday'],
      Saturday: formData['Saturday'],
      Sunday: formData['Sunday']
    })
    this.form.get('Additional')['controls'][sendTypeIdx].get("Id").setValue(formData['Id']);
    this.form.get('Additional')['controls'][sendTypeIdx].get("Hours").patchValue({
      Start: new Date().setHours(Number(formData['StartTime'].split(':')[0]), Number(formData['StartTime'].split(':')[1]), 0),
      End: new Date().setHours(Number(formData['EndTime'].split(':')[0]), Number(formData['EndTime'].split(':')[1]), 0)
    });
    let summaryTypeId = formData['UserNotificationSummaryTypeId'];
    let summaryValue: any = {};
    this.summaryTypes.forEach(summaryType => {
      if(summaryType.Id == summaryTypeId) {
        summaryValue[summaryType.Id] = true;
      } else {
        summaryValue[summaryType.Id] = false;
      }
    });
    this.form.get('Additional')['controls'][sendTypeIdx].get("Summary").patchValue(summaryValue);
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

  submitNotificationSchedule() {
    this.onChangeBuildingNotificationSchedule(this.selectedNotificationTab);
  }
}
