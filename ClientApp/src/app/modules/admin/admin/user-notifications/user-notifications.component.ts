import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AllowedPageSizes } from '@core/helpers';
import { IUmfaBuilding, IUmfaPartner } from '@core/models';
import { BuildingService, UserService } from '@shared/services';
import { UserNotificationsService } from '@shared/services/user-notifications.service';
import { Subject, takeUntil } from 'rxjs';
import { SetUserNotificationComponent } from './set-user-notification/set-user-notification.component';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit {

  searchForm: UntypedFormGroup;
  partners: IUmfaPartner[] = [];
  allBuildings: IUmfaBuilding[] = [];
  buildings: IUmfaBuilding[] = [];
  users: any[] = [];
  
  readonly allowedPageSizes = AllowedPageSizes;
  
  userNotifications: any[] = [];
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _formBuilder: FormBuilder,
    private _buildingService: BuildingService,
    private _userService: UserService,
    private _userNotificationsService: UserNotificationsService,
    private _router: Router,
    private _matDialog: MatDialog,
  ) { 
    this.onEdit = this.onEdit.bind(this);
  }

  ngOnInit(): void {
    this.searchForm = this._formBuilder.group({
      partnerId: [],
      buildingId: [],
      userId: []
    });
    this._userNotificationsService.userNotifications$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.userNotifications = data.map(item => {
          item['Night Flow'] = item['Night Flow'] == 1 ? true : false;
          item['Burst Pipe'] = item['Burst Pipe'] == 1 ? true : false;
          item['Leak'] = item['Leak'] == 1 ? true : false;
          item['Daily Usage'] = item['Daily Usage'] == 1 ? true : false;
          item['Peak'] = item['Peak'] == 1 ? true : false;
          item['Average'] = item['Average'] == 1 ? true : false;

          return item;
        });
      })

    this._buildingService.buildings$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: IUmfaBuilding[]) => {
        this.allBuildings = data;
        this.buildings = data;
      })

    this._buildingService.partners$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: IUmfaPartner[]) => {
        this.partners = data;
      })

    this._userService.users$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.users = data;
      })

    this.searchForm.valueChanges.subscribe(formData => {
      if(formData['buildingId'] && formData['userId']) {
        this.getUserNotifications();
      }
    })
  }

  getUserNotifications() {
    this._userNotificationsService.getUserAlarmNotificationConfig(this.searchForm.value).subscribe();
  }

  customSearch(term: string, item: any) {
    term = term.toLowerCase();
    return item.Name.toLowerCase().indexOf(term) > -1;
  }

  onPartnerChanged(event) {
    this.buildings = this.allBuildings.filter(obj => obj.PartnerId == event.Id);
  }

  onBuildingChanged(event) {
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onEdit(e) {
    e.event.preventDefault();
    this._matDialog.open(SetUserNotificationComponent, {autoFocus: false, data: {
      detail: e.row.data,
      AMRMeterId: e.row.data['AMRMeterId'],
      UserId: this.searchForm.get('userId').value
    } })
      .afterClosed()
      .subscribe((res) => {
        this.getUserNotifications();
      });
    //this._router.navigate([`/admin/amrSchedule/edit/${e.row.data.Id}`]);
  }
}
