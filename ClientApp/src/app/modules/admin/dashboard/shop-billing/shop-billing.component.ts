import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';
import { AllowedPageSizes } from '@core/helpers';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-shop-billing',
  templateUrl: './shop-billing.component.html',
  styleUrls: ['./shop-billing.component.scss']
})
export class ShopBillingComponent implements OnInit {

  dataSource: any;
  periodList: any[] = [];
  periodIdList: any[] = [];
  tenantId: number;

  readonly allowedPageSizes = AllowedPageSizes;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private service: DashboardService,
    private decimalPipe: DecimalPipe,
    private elementRef:ElementRef,
    private renderer:Renderer2
  ) { }

  ngOnInit(): void {
    this.service.shopBillingDetail$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          //this.dataSource = res;
          this.tenantId = res[0]['TenantID'];
          res.forEach(item => {
            if(this.periodList.indexOf(item['PeriodName']) == -1) this.periodList.push(item['PeriodName']);
            if(this.periodIdList.indexOf(item['PeriodID']) == -1) this.periodIdList.push(item['PeriodID']);
          });
          this.dataSource = {
            fields: [
              {
                caption: 'Region',
                dataField: 'GroupName',
                expanded: true,
                area: 'row',
              },
              {
                dataField: 'PeriodName',
                area: 'column',
              },
              {
                caption: 'Usage',
                dataField: 'Usage',
                dataType: 'number',
                summaryType: 'sum',
                customizeText: (cellInfo) => {
                  return this.decimalPipe.transform(cellInfo.value);
                },
                area: 'data',
              },
              {
                caption: 'Amount',
                dataField: 'Amount',
                dataType: 'number',
                summaryType: 'sum',
                customizeText: (cellInfo) => {
                  return 'R ' + this.decimalPipe.transform(cellInfo.value);
                },
                area: 'data',
              },
            ],
            store: res
          }
          setTimeout(() => {
            let elements = this.elementRef.nativeElement.querySelectorAll('.total-element');
            elements.forEach( element => {
              this.renderer.listen(element, "click", event => {
                let periodName = event.target.getAttribute('periodname');
                let periodIdx = this.periodList.indexOf(periodName);
                let data = {
                  tenantId: this.tenantId,
                  shopId: [0],
                  periodId: this.periodIdList[periodIdx],
                  reportType: 2
                }
                this.service.showTenantSlipDetail(data);
              });
            });
          }, 2000);          
        }
      });
  }

  cellPrepared(e) {  
    if (e.cell.rowType == "GT") {
      if (e.columnIndex % 2 == 0) {
        e.cellElement.innerText = "";  
        e.cellElement.innerHTML = "";  
      } else {
        console.log(e);
        e.cellElement.innerHTML = "<a href='javascript:void(0);' class='total-element cursor-pointer text-blue-600' periodname='"+e.cell.columnPath[0]+"'>"+e.cell.text+"</a>";
      }
    }
  }

  ngAfterViewInit() {
    
  }
  
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
      this.service.showShopBilling(null);
  }
}
