import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DXReportService } from '@shared/services';

@Component({
  selector: 'app-tenant-billing-detail',
  templateUrl: './tenant-billing-detail.component.html',
  styleUrls: ['./tenant-billing-detail.component.scss']
})
export class TenantBillingDetailComponent implements OnInit {

  @Input() buildingId;
  @Input() periodId;
  @Input() tenantId;
  @Input() tenantName;

  shopList: any[] = [];
  periodList$ = this.reportService.obsPeriods;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private dashboardService: DashboardService,
    private _cdr: ChangeDetectorRef,
    private reportService: DXReportService
  ) { }

  custPeriodTemplate = (arg: any) => {
    const datepipe: DatePipe = new DatePipe('en-ZA');
    var ret = "<div class='custom-item' title='(" + arg.PeriodName + ")'>" + arg.PeriodName + "</div>";
    return ret;
  }
  
  ngOnInit(): void {
    this.reportService.loadPeriods(this.buildingId);
    this.dashboardService.billingDetailsForTenant$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          console.log(res);
          this.shopList = [];
          res.forEach(billing => {
            if(!this.shopList.find(shop => shop['ShopId'] == billing['ShopId'])) this.shopList.push({ShopId: billing['ShopId'], Shop: billing['Shop']});
          })
          this.shopList.forEach(shop => {
            let filteredBillingsByShop = res.filter(obj => obj['ShopId'] == shop['ShopId']);
            let groups = []; 
            let totalAmountByShop = 0;
            filteredBillingsByShop.forEach(billing => {
              if(!groups.find(group => group['GroupID'] == billing['GroupID'])) groups.push({GroupID: billing['GroupID'], InvGroup: billing['InvGroup']});
              totalAmountByShop += billing['Amount'];
            })
            groups.forEach(group => {
              let filteredBillingByGroup = res.filter(obj => obj['ShopId'] == shop['ShopId'] && obj['GroupID'] == group['GroupID']);
              let billingTypes = [];
              let totalAmount = 0;
              filteredBillingByGroup.forEach(billing => {
                if(!billingTypes.find(type => type['BillingType'] == billing['BillingType'])) billingTypes.push({BillingType: billing['BillingType']});
                totalAmount += billing['Amount'];
              })

              billingTypes.forEach(type => {
                let filteredBillingByType = res.filter(obj => obj['ShopId'] == shop['ShopId'] && obj['GroupID'] == group['GroupID'] && obj['BillingType'] == type['BillingType']);

                type['Billings'] = filteredBillingByType;
              })
              group['BillingTypes'] = billingTypes;
              group['Amount'] = totalAmount;
            })

            shop['Groups'] = groups;
            shop['Amount'] = totalAmountByShop;
          })
          this._cdr.detectChanges();
          console.log(this.shopList);
        } else {
          this.shopList = [];
          this._cdr.detectChanges();
        }
      });
  }

  changePeriod($event) {
    this.dashboardService.getBillingDetailsForTenant(this.buildingId, this.tenantId, this.periodId).subscribe();
  }
  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    this.dashboardService.destroyBillingDetailForTenant();
  }

}
