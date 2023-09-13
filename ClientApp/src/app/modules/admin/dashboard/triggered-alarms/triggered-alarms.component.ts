import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AllowedPageSizes } from '@core/helpers';
import { DXReportService, UserService } from '@shared/services';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'app-triggered-alarms',
  templateUrl: './triggered-alarms.component.html',
  styleUrls: ['./triggered-alarms.component.scss']
})
export class TriggeredAlarmsComponent implements OnInit {

  readonly allowedPageSizes = AllowedPageSizes;
  
  @Input() buildingId: number;
  @Input() partnerId: number;
  
  form: UntypedFormGroup;
  partnerList$ = this.reportService.obsPartners;
  buildingList$ = this.reportService.obsBuildings;
  
  applyFilterTypes: any;
  currentFilter: any;
  dataSource: any;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private reportService: DXReportService,
    private dashboardService: DashboardService,
    private _cdr: ChangeDetectorRef,
    private _userService: UserService
  ) { 
    this.applyFilterTypes = [{
      key: 'auto',
      name: 'Immediately',
    }, {
        key: 'onClick',
        name: 'On Button Click',
    }];
    this.currentFilter = this.applyFilterTypes[0].key;
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      PartnerId: [null],
      BuildingId: [null, Validators.required],
    })
    this.partnerList$.subscribe(res => {
      if(this.partnerId && res && res.length > 0) {
        this.form.get('PartnerId').setValue(this.partnerId);
        this.reportService.selectPartner(this.partnerId);
      }
    })

    if(this.buildingId) {
      this.form.get('BuildingId').setValue(this.buildingId);
      this.dashboardService.getTriggeredAlarmsList(this._userService.userValue.UmfaId, this.buildingId).subscribe();
    } else {
      this.dashboardService.getTriggeredAlarmsList(this._userService.userValue.UmfaId, 0).subscribe();
    }

    this.dashboardService.triggeredAlarmsList$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          this.dataSource = res;
          this._cdr.markForCheck();
        } else {
          this.dataSource = [];
        }
        // if(this.dataSource.length > 0) this.initiatedList = true;
        // if(!this.buildingId) {
        //   if(this.dashboardService.selectedShopInfo) {
        //     this.form.get('PartnerId').setValue(this.dashboardService.selectedShopInfo.partnerId);
        //     this.form.get('BuildingId').setValue(this.dashboardService.selectedShopInfo.buildingId);
        //   }
        // }
        
      })

      
  }

  custPartnerTemplate = (arg: any) => {
    var ret = "<div class='custom-item' title='" + arg.Name + "'>" + arg.Name + "</div>";
    return ret;
  }

  custBldTemplate = (arg: any) => {
    var ret = "<div class='custom-item' title='" + arg.Name + " (" + arg.Partner + ")'>" + arg.Name + "</div>";
    return ret;
  }

  valueChanged(e: any, method: string) {
    if(method == 'Partner') {
      this.reportService.selectPartner(this.form.get('PartnerId').value);
    } else if(method == 'Building') {
      //this.dashboardService.selectedShopInfo = {'buildingId': this.form.get('BuildingId').value, 'partnerId': this.form.get('PartnerId').value};
      this.dashboardService.getTriggeredAlarmsList(this._userService.userValue.UmfaId, this.form.get('BuildingId').value).subscribe();
    }
  }

  onRowClick(event) {
    if(event.data) {
      this.dashboardService.showTriggeredAlarmDetail(event.data);
      //this.dashboardService.getAlarmTriggered(event.data.AMRMeterTriggeredAlarmId).subscribe();
    }
  }

  onCustomizeDateTime(cellInfo) {
    return moment(new Date(cellInfo.value)).format('YYYY-MM-DD HH:mm:ss');
  }

  /**
     * On destroy
     */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
      this.dashboardService.destroyTriggeredAlarm();
  }
}
