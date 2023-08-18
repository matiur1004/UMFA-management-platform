import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../dasboard.service';
import { AllowedPageSizes } from '@core/helpers';
import moment from 'moment';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-shop-assigned-meters',
  templateUrl: './shop-assigned-meters.component.html',
  styleUrls: ['./shop-assigned-meters.component.scss']
})
export class ShopAssignedMetersComponent implements OnInit {

  dataSource: any;
  applyFilterTypes: any;
  currentFilter: any;
  form: UntypedFormGroup;
  activeItemList = ['Yes', 'No', 'All'];
  allItems: any[] = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  readonly allowedPageSizes = AllowedPageSizes;
  
  constructor(
    private dashboardService: DashboardService,
    private _formBuilder: UntypedFormBuilder,
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
      active: ['All'],
    })

    this.dashboardService.shopAssignedMetersDashboard$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        console.log(res);
        if(res) {
          this.allItems = res.map(item => {
            let historyVal = item.UsageHistory ? item.UsageHistory.split(", ") : [];
            historyVal = historyVal.map(val => Number(val));
            return {...item, UsageHistory: historyVal};
          });
          this.dataSource = this.allItems;
        }
      });

      this.form.get('active').valueChanges.subscribe(res => {
        if(res == 'All') this.dataSource = this.allItems;
        else {
          let status = res == "Yes" ? true : false;
          let results = this.allItems.filter(obj => obj['IsActive'] == status);
          this.dataSource = results;
        }
      })
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
      this.dashboardService.destroyShopAssignedMeters();
  }

}
