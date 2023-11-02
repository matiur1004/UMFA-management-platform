import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AllowedPageSizes } from '@core/helpers';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../dasboard.service';
import moment from 'moment';

@Component({
  selector: 'app-tenant-occupations',
  templateUrl: './tenant-occupations.component.html',
  styleUrls: ['./tenant-occupations.component.scss']
})
export class TenantOccupationsComponent implements OnInit {
  
  @Input() buildingId;
  @Input() tenantId;

  dataSource: any;
  applyFilterTypes: any;
  currentFilter: any;
  includeOption: boolean = false;
  includeOptions = [{label: 'Yes', value: true}, {label: 'No', value: false}];

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  readonly allowedPageSizes = AllowedPageSizes;
  
  constructor(
    private dashboardService: DashboardService,
    private _cdr: ChangeDetectorRef
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
    this.dashboardService.tenantOccupationDetails$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          this.dataSource = res;
          this._cdr.detectChanges();
        }
      });
  }

  valueChanged(event, type) {
    this.dashboardService.getTenantDashboardOccupations(this.buildingId, this.tenantId, event.value)
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(result => {
                        });
  }
  
  onCustomizeDateTime(cellInfo) {
    if(!cellInfo.value) return 'N/A';
    return moment(new Date(cellInfo.value)).format('DD/MM/YYYY');
  }

  /**
     * On destroy
     */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
      this.dashboardService.destroyTenantOccupation();
  }

}
