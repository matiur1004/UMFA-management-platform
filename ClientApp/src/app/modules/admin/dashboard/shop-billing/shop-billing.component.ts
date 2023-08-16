import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';
import { AllowedPageSizes } from '@core/helpers';
import { DecimalPipe } from '@angular/common';
import moment from 'moment';

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
  monthNameList
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
          this.dataSource = {
            fields: [
              {
                caption: 'Region',
                dataField: 'GroupName',
                expanded: true,
                area: 'row',
              },
              {
                dataField: 'PeriodDate',
                area: 'column',
                dataType: 'date',
                expanded: true,
                groupName: "Date"  
              },
              { groupName: "Date", groupInterval: "year", groupIndex: 0 },  

              { groupName: "Date", groupInterval: "month", groupIndex: 1 }, 
              {
                caption: 'Usage',
                dataField: 'Usage',
                dataType: 'number',
                summaryType: 'sum',
                customizeText: (cellInfo) => {
                  if(cellInfo.value) {
                    return this.decimalPipe.transform(cellInfo.value);
                  } else {
                    return '0.00';
                  }
                },
                area: 'data',
              },
              {
                caption: 'Amount',
                dataField: 'Amount',
                dataType: 'number',
                summaryType: 'sum',
                customizeText: (cellInfo) => {
                  if(cellInfo.value) {
                    return 'R ' + this.decimalPipe.transform(cellInfo.value);
                  } else {
                    return 'R ' + '0.00';
                  }
                  
                },
                area: 'data',
              },
            ],
            store: [],
            fieldPanel: {
              visible: false,
              showFilterFields: false
            },
            allowSorting: false,
            allowSortingBySummary: false
          }
          this.tenantId = res[0]['TenantID'];
          this.dataSource.store = res.map(item => {
            if(this.periodList.indexOf(item['PeriodName']) == -1) this.periodList.push(item['PeriodName']);
            if(this.periodIdList.indexOf(item['PeriodID']) == -1) this.periodIdList.push(item['PeriodID']);
            if(!item['Amount']) res['Amount'] = 0;
            item['PeriodDate'] = moment(new Date(item.PeriodName)).format('YYYY/MM/DD');
            return item;
          });
          
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
        let periodName = moment(new Date(e.cell.columnPath[0] + '-' + e.cell.columnPath[1] + '-01')).format('MMMM YYYY');
        e.cellElement.innerHTML = "<a href='javascript:void(0);' class='total-element cursor-pointer text-blue-600' periodname='"+periodName+"'>"+e.cell.text+"</a>";
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
