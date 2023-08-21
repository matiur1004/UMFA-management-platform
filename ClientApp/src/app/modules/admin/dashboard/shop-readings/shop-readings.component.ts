import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AllowedPageSizes } from '@core/helpers';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../dasboard.service';
import moment from 'moment';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-shop-readings',
  templateUrl: './shop-readings.component.html',
  styleUrls: ['./shop-readings.component.scss']
})
export class ShopReadingsComponent implements OnInit {

  @Input() shopId;
  @Input() buildingId;
  @Input() meterId;

  dataSource: any;
  applyFilterTypes: any;
  currentFilter: any;
  meters: any;
  form: UntypedFormGroup;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  readonly allowedPageSizes = AllowedPageSizes;
  
  constructor(
    private dashboardService: DashboardService,
    private _formBuilder: UntypedFormBuilder,
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
    this.form = this._formBuilder.group({
      meterId: [null],
    })
    this.dashboardService.metersForBuilding$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) this.meters = res;
      });

    this.dashboardService.shopReadingsDashboard$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          this.dataSource = res.map(item => {
            return {...item, Contribution: Math.round(item['Contribution'] * 10000) / 100 + ' %'}
          });
          this._cdr.detectChanges();
        }
      });

    if(this.meterId) {
      this.form.get("meterId").setValue(this.meterId);
      this.dashboardService.getShopBillingsByMeter(this.form.get('meterId').value, this.shopId, this.buildingId).subscribe();
    }
  }

  onCustomizeDate(cellInfo) {
    if(!cellInfo.value) return 'N/A';
    return moment(new Date(cellInfo.value)).format('DD/MM/YYYY');
  }
  
  meterChanged(event) {
    this.dashboardService.getShopBillingsByMeter(this.form.get('meterId').value, this.shopId, this.buildingId).subscribe();
  }

  /**
     * On destroy
     */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
      this.dashboardService.destroyShopReadings();
  }

}
