import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';
import { AllowedPageSizes } from '@core/helpers';
import { DecimalPipe } from '@angular/common';
import moment from 'moment';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { UmfaUtils } from '@core/utils/umfa.utils';

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
  initMonthNameList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  initMonthAbbrList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  monthNameList = [];
  monthAbbrList = [];

  tenantList: any[] = [];
  groupNameList: any[] = [];
  yearList: any[] = [];
  utilityList: any[] = [];
  groupsByUtility: any = {};
  billingChartType = 'Bar';
  usageChartType = 'Bar';
  billingGroupItems = [];
  selectedGroupsForBilling;
  groupColors = ['#008E0E', '#452AEB', '#2FAFB7', '#C23BC4', '#6E6E6E', '#46a34a', '#C24F19', '#C8166C', '#84cc16', '#06b6d4', '#8b5cf6', '#f59e0b', '#6b21a8', '#9f1239', '#d946ef', '#a855f7'];
  availableGroupColors: any;

  lineChartSeries: any = {};
  lineUsageChartSeries: any = {};

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
    private renderer:Renderer2,
    private _utils: UmfaUtils,
    private _cdr: ChangeDetectorRef
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
          groups: []
        }
      },
      yaxis: {
        labels: {
          formatter: function(val) {
            return 'R ' + val;
          } 
        }
      },
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
        labels: {
          formatter: function(val) {
            return 'R ' + val;
          } 
        }
      },
      legend: {
        show: false
      }
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
        labels: {
          formatter: function(val) {
            return '' + val;
          } 
        }
      },
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
          groups: []
        }
      },
      yaxis: {
        labels: {
          formatter: function(val) {
            return '' + val;
          } 
        }
      },
    };
  }

  ngOnInit(): void {
    this.service.shopBillingDetail$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          res = res.sort((a, b) => {
            if(a['PeriodID'] > b['PeriodID']) return 1;
            if(a['PeriodID'] < b['PeriodID']) return -1;
            return 0
          })
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
            if(this.utilityList.indexOf(item['Utility']) == -1) this.utilityList.push(item['Utility']);

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

          let lastMonth = res[res.length - 1]['PeriodName'].split(' ')[0];
          let monthIdx = this.initMonthNameList.indexOf(lastMonth);
          for(let k = monthIdx; k >=0; k--) {
            this.monthNameList.push(this.initMonthNameList[k]);
            this.monthAbbrList.push(this.initMonthAbbrList[k]);
          }
          for(let k = 11; k > monthIdx; k--) {  
            this.monthNameList.push(this.initMonthNameList[k]);
            this.monthAbbrList.push(this.initMonthAbbrList[k]);
          }
          
          this.monthNameList = this.monthNameList.reverse();
          this.monthAbbrList = this.monthAbbrList.reverse();
          
          this.barChartOptions.xaxis.group.groups = [];
          this.monthAbbrList.forEach(val => {
            this.barChartOptions.xaxis.group.groups.push({title: val, cols: this.yearList.length});
            this.barUsageChartOptions.xaxis.group.groups.push({title: val, cols: this.yearList.length});
          });

          this.billingGroupItems = [{Id: '0', Name: 'All', expanded: true}];
          let selectedValue = ['0'];
          this.groupNameList.map(groupName => {
            let item = {Id: groupName, Name: groupName, categoryId: '0'};
            selectedValue.push(groupName);
            this.billingGroupItems.push(item);
          })
          this.selectedGroupsForBilling = selectedValue;

          this.lineChartOptions.xaxis.categories = this.monthAbbrList;
          this.lineUsageChartOptions.xaxis.categories = this.monthAbbrList;

          this.setChartColors();

          this.setChart();
        }
      });
  }

  setChartColors() {
    this.utilityList.forEach(utility => {
      this.groupsByUtility[utility] = [];
      let filteredBillings = this.response.filter(billing => billing['Utility'] == utility);
      filteredBillings.forEach(billing => {
        if(this.groupsByUtility[utility].indexOf(billing['GroupName'].trim()) == -1 && this.selectedGroupsForBilling.indexOf(billing['GroupName'].trim()) > -1) 
          this.groupsByUtility[utility].push(billing['GroupName'].trim());
      })
    })
    this.availableGroupColors = this._utils.getColors(this.groupsByUtility);

    this.barChartOptions.colors = this.availableGroupColors;
    this.lineChartOptions.colors = this.availableGroupColors;
    this.barUsageChartOptions.colors = this.availableGroupColors;
    this.lineUsageChartOptions.colors = this.availableGroupColors;
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
    this.setChartColors();
    this.setChart();
    
  }

  setChart() {
    let billingBarSeriesData = [];    
    let usageBarSeriesData = [];    

    Object.keys(this.groupsByUtility).forEach(key => {
      this.groupsByUtility[key].forEach(groupName => {
        this.selectedGroupsForBilling.filter(obj=> obj != '0').forEach(groupName1 => {
          if(groupName == groupName1) {
            let result = {name: groupName, data: []};
            let usageResult = {name: groupName, data: []};

            this.monthNameList.forEach(month => {
              this.yearList.forEach(year => {
                let filter = this.response.find(item => item['PeriodName'] == `${month} ${year}` && item['GroupName'] == groupName);
                if(filter) result['data'].push({x: '`' + year.split('20')[1], y: filter['Amount']});
                else result['data'].push({x: '`' + year.split('20')[1], y: 0});

                if(filter) usageResult['data'].push({x: '`' + year.split('20')[1], y: filter['Usage']});
                else usageResult['data'].push({x: '`' + year.split('20')[1], y: 0});
              })
            });            

            billingBarSeriesData.push(result);
            usageBarSeriesData.push(usageResult);
          }
        });
      })
    });

    this.yearList.forEach(year => {
      let billingLineSeriesData = [];
      let usageLineSeriesData = [];
      Object.keys(this.groupsByUtility).forEach(key => {
        this.groupsByUtility[key].forEach(groupName => {
          this.selectedGroupsForBilling.filter(obj=> obj != '0').forEach(groupName1 => {
            if(groupName == groupName1) {
              let lineResult = {name: groupName, data: []};
              let usageLineResult = {name: groupName, data: []};
              this.monthNameList.forEach(month => {
                let filter = this.response.find(item => item['PeriodName'] == `${month} ${year}` && item['GroupName'] == groupName);
                if(filter) { lineResult['data'].push(filter['Amount']);usageLineResult['data'].push(filter['Usage']);}
                else { lineResult['data'].push(0);usageLineResult['data'].push(0)}
              })
              billingLineSeriesData.push(lineResult);
              usageLineSeriesData.push(usageLineResult);
            }
          })
        })
      })
      this.lineChartSeries[year] = billingLineSeriesData;
      this.lineUsageChartSeries[year] = usageLineSeriesData;
    })
        
    this.barChartOptions.series = billingBarSeriesData;
    this.barUsageChartOptions.series = usageBarSeriesData;
  }

  lineChartYearChange() {
    window.dispatchEvent(new Event('resize'));
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
