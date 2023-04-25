import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { AllowedPageSizes } from '@core/helpers';
import { IUmfaBuilding, IUmfaPartner } from '@core/models';
import { BuildingService } from '@shared/services';
import { UserNotificationsService } from '@shared/services/user-notifications.service';
import { Subject, takeUntil } from 'rxjs';

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
    private _userNotificationsService: UserNotificationsService
  ) { }

  ngOnInit(): void {
    this.searchForm = this._formBuilder.group({
      partnerId: [],
      buildingId: []
    });
    this._userNotificationsService.userNotifications$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.userNotifications = data;
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
}
