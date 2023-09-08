import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';
import { AllowedPageSizes } from '@core/helpers';
import { DecimalPipe } from '@angular/common';
import moment from 'moment';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
  fill: ApexFill;
  legend: ApexLegend;
  tooltip: ApexTooltip;
};

export type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
  fill: ApexFill;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  title: any;
  grid: any;
  markers: any;
};
@Component({
  selector: 'app-shop-billing',
  templateUrl: './shop-billing.component.html',
  styleUrls: ['./shop-billing.component.scss']
})
export class ShopBillingComponent implements OnInit {

  @Input() shopId: number;
  
  dataSource: any;
  response: any;

  periodList: any[] = [];
  periodIdList: any[] = [];
  tenantId: number;
  monthNameList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  tenantList: any[] = [];
  groupNameList: any[] = [];
  yearList: any[] = [];
  billingChartType = 'Bar';
  usageChartType = 'Bar';
  billingGroupItems = [];
  selectedGroupsForBilling;
  groupColors = ['#008E0E', '#452AEB', '#2FAFB7', '#C23BC4', '#6E6E6E', '#46a34a', '#C24F19', '#C8166C', '#84cc16', '#06b6d4', '#8b5cf6', '#f59e0b', '#6b21a8', '#9f1239', '#d946ef', '#a855f7'];
  availableGroupColors: any;

  public barChartOptions: Partial<BarChartOptions>;
  public barUsageChartOptions: Partial<BarChartOptions>;
  public lineChartOptions: Partial<LineChartOptions>;
  public lineUsageChartOptions: Partial<LineChartOptions>;
  
  readonly allowedPageSizes = AllowedPageSizes;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private service: DashboardService,
    private decimalPipe: DecimalPipe,
    private elementRef:ElementRef,
    private renderer:Renderer2
  ) {
    this.barChartOptions = {
      series: [        
      ],
      chart: {
        type: 'bar',
        height: 450,
        stacked: true,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        type: 'category',
        labels: {
          formatter: function(val) {
            return val;
          },
        },
        group: {
          style: {
            fontSize: '10px',
            fontWeight: 700
          },
          groups: [
            { title: 'Jan', cols: 2 },
            { title: 'Feb', cols: 2 },
            { title: 'Mar', cols: 2 },
            { title: 'Apr', cols: 2 },
            { title: 'May', cols: 2 },
            { title: 'Jun', cols: 2 },
            { title: 'Jul', cols: 2 },
            { title: 'Aug', cols: 2 },
            { title: 'Sep', cols: 2 },
            { title: 'Oct', cols: 2 },
            { title: 'Nov', cols: 2 },
            { title: 'Dec', cols: 2 },
          ]
        }
      }
    };

    this.lineChartOptions = {
      series: [
      ],
      chart: {
        height: 400,
        type: "line",
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      markers: {
        size: 3
      },
      xaxis: {
        categories: []
      },
      yaxis: {
        title: {
        },
      },
    };
    this.lineUsageChartOptions = {
      series: [
      ],
      chart: {
        height: 400,
        type: "line",
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      markers: {
        size: 3
      },
      xaxis: {
        categories: []
      },
      yaxis: {
        title: {
        },
      }
    };
    this.barUsageChartOptions = {
      series: [        
      ],
      chart: {
        type: 'bar',
        height: 450,
        stacked: true,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        type: 'category',
        labels: {
          formatter: function(val) {
            return val;
          },
        },
        group: {
          style: {
            fontSize: '10px',
            fontWeight: 700
          },
          groups: [
            { title: 'Jan', cols: 2 },
            { title: 'Feb', cols: 2 },
            { title: 'Mar', cols: 2 },
            { title: 'Apr', cols: 2 },
            { title: 'May', cols: 2 },
            { title: 'Jun', cols: 2 },
            { title: 'Jul', cols: 2 },
            { title: 'Aug', cols: 2 },
            { title: 'Sep', cols: 2 },
            { title: 'Oct', cols: 2 },
            { title: 'Nov', cols: 2 },
            { title: 'Dec', cols: 2 },
          ]
        }
      }
    };
  }

  ngOnInit(): void {
    this.service.shopBillingDetail$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          this.response = res;
          this.dataSource = {
            fields: [
              {
                caption: 'Region',
                width: 120,
                dataField: 'Tenant',
                area: 'row',
                expanded: true,
              },
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
              { groupName: "Date", groupInterval: "year", groupIndex: 0, expandable: false },  

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
            if(!this.tenantList.find(obj => obj.TenantID == item['TenantID'])) {
              this.tenantList.push({TenantID: item['TenantID'], Tenant: item['Tenant']});
            }
            if(!this.groupNameList.find(group => group == item['GroupName'])) {
              this.groupNameList.push(item['GroupName']);
            }
            if(!this.yearList.find(year => year == item['PeriodName'].split(' ')[1])) {
              this.yearList.push(item['PeriodName'].split(' ')[1]);
            }
            if(!item['Amount']) res['Amount'] = 0;
            item['PeriodDate'] = moment(new Date(item.PeriodName)).format('YYYY/MM/DD');
            return item;
          });
          this.availableGroupColors = this.groupNameList.map((groupName, idx) => this.groupColors[idx]);
          this.billingGroupItems = [{Id: '0', Name: 'All', expanded: true}];
          let selectedValue = ['0'];
          this.groupNameList.map(groupName => {
            let item = {Id: groupName, Name: groupName, categoryId: '0'};
            selectedValue.push(groupName);
            this.billingGroupItems.push(item);
          })
          this.selectedGroupsForBilling = selectedValue;

          this.lineChartOptions.xaxis.categories = this.periodList.map(period => {
            return `${period.split(' ')[0].substring(0, 3)} ${period.split(' ')[1].substring(2, 4)}`;
          });
          this.lineUsageChartOptions.xaxis.categories = this.lineChartOptions.xaxis.categories;
          this.barChartOptions.colors = this.availableGroupColors;
          this.lineChartOptions.colors = this.availableGroupColors;
          this.barUsageChartOptions.colors = this.availableGroupColors;
          this.lineUsageChartOptions.colors = this.availableGroupColors;
          this.setChart();
        }
      });
  }

  contentReady(e) {
    setTimeout(() => {
      let elements = this.elementRef.nativeElement.querySelectorAll('.total-element');
      elements.forEach( element => {
        this.renderer.listen(element, "click", event => {
          let periodName = event.target.getAttribute('periodname');
          let periodIdx = this.periodList.indexOf(periodName);
          let tenant = this.tenantList.find(obj => obj['Tenant'] == event.target.getAttribute('tenantname'));
          let data = {
            tenantId: tenant['TenantID'],
            shopId: this.shopId,
            periodId: this.periodIdList[periodIdx],
            reportType: 1
          }
          this.service.showTenantSlipDetail(data);
        });
      });
    }, 2000);
  }

  cellPrepared(e) {
    if (e.cell.rowType == "T" || (e.cell.rowPath && e.cell.rowPath.length == 1)) {
      if (e.columnIndex % 2 == 0) {
        e.cellElement.innerText = "";  
        e.cellElement.innerHTML = "";  
      } else {
        if(e.cell.columnPath.length == 1) {
          e.cellElement.innerHTML = "<a href='javascript:void(0);' class='cursor-pointer text-blue-600'>"+e.cell.text+"</a>";
        } else {
          let periodName = moment(new Date(e.cell.columnPath[0] + '-' + e.cell.columnPath[1] + '-01')).format('MMMM YYYY');
          let tenantName = e.cell.rowPath[0];
          e.cellElement.innerHTML = "<a href='javascript:void(0);' class='total-element cursor-pointer text-blue-600' tenantname='"+tenantName+"' periodname='"+periodName+"'>"+e.cell.text+"</a>";
        }
        
      }
    }
  }

  onTreeViewReady(event) {
    event.component.selectAll();
    this.selectedGroupsForBilling = event.component.getSelectedNodeKeys();
  }

  onInitialized(event) {
    event.component.selectAll();
  }

  onTreeViewSelectionChanged(event) {
    if(event.itemData.Id == '0') {
      if(event.itemData.selected == true) {
        this.billingGroupItems.forEach(item => {
          if(item['Id'] != '0') {
            event.component.selectItem(item['Id']);
          }
        })
      } else {
        event.component.unselectAll();
      }
    }
    this.selectedGroupsForBilling = event.component.getSelectedNodeKeys();
    this.setChart();
    
  }

  setChart() {
    let billingBarSeriesData = [];
    let billingLineSeriesData = [];
    let usageBarSeriesData = [];
    let usageLineSeriesData = [];
    this.selectedGroupsForBilling.filter(obj=> obj != '0').forEach(groupName => {
      let result = {name: groupName, data: []};
      let lineResult = {name: groupName, data: []};
      let usageResult = {name: groupName, data: []};
      let usageLineResult = {name: groupName, data: []};
      this.monthNameList.forEach(month => {
        this.yearList.forEach(year => {
          let filter = this.response.find(item => item['PeriodName'] == `${month} ${year}` && item['GroupName'] == groupName);
          if(filter) result['data'].push({x: '`' + year.split('20')[1], y: filter['Amount']});
          else result['data'].push({x: '`' + year.split('20')[1], y: 0});

          if(filter) usageResult['data'].push({x: '`' + year.split('20')[1], y: filter['Usage']});
          else usageResult['data'].push({x: '`' + year.split('20')[1], y: 0});

        })
      });

      this.periodList.forEach(period => {
        let filter = this.response.find(item => item['PeriodName'] == period && item['GroupName'] == groupName);
        if(filter) { lineResult['data'].push(filter['Amount']); usageLineResult['data'].push(filter['Usage']);}
        else {lineResult['data'].push(0); usageLineResult['data'].push(0);}
      })

      billingBarSeriesData.push(result);
      billingLineSeriesData.push(lineResult);
      usageBarSeriesData.push(usageResult);
      usageLineSeriesData.push(usageLineResult);
    });
    
    this.barChartOptions.series = billingBarSeriesData;
    this.lineChartOptions.series = billingLineSeriesData;
    this.barUsageChartOptions.series = usageBarSeriesData;
    this.lineUsageChartOptions.series = usageLineSeriesData;
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
