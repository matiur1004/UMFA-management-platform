import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../dasboard.service';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import { UmfaUtils } from '@core/utils/umfa.utils';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  plotOptions: any;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  yaxis: ApexYAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  colors: any
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

export type TreemapChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  colors: string[];
}

@Component({
  selector: 'app-tenant-detail',
  templateUrl: './tenant-detail.component.html',
  styleUrls: ['./tenant-detail.component.scss']
})
export class TenantDetailComponent implements OnInit {

  @Input() buildingId: number;
  @Input() tenantId: number;
  @Input() tenantName: string;
  
  dataSource: any;
  billingSummaryDataSource: any;
  tenantDetailDashboard: any;
  lastPeriodName: string;
  lastPeriodBillings: any[] = [];
  billingTotal: number;
  shopListItems: any[] = [{value: 0, label: 'All'}];
  allAvailableImages: number;
  groupList: any[] = [];
  groupsByUtility: any = {};
  utilityList: any[] = [];
  periodList: any[] = [];
  periodItemList: any[] = [];
  billingPeriodList: any[] = [];

  initMonthNameList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  initMonthAbbrList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  monthNameList = [];
  monthAbbrList = [];

  yearList = [];
  availableGroupColors: any;  
  selectedMonth;

  selectedShop: number = 0;
  includeVacant: boolean = false;
  public treeMapOptions: Partial<TreemapChartOptions>;

  billingElectricityChartType: string = 'Bar';
  billingUsageElectricityChartType: string = 'Bar';
  billingWaterChartType: string = 'Bar';
  billingUsageWaterChartType: string = 'Bar';
  billingSewerChartType: string = 'Bar';
  billingUsageSewerChartType: string = 'Bar';

  billingElectricitySeries = [];
  billingUsageElectricitySeries = [];
  billingWaterSeries = [];
  billingUsageWaterSeries = [];
  billingSewerageSeries = [];
  billingUsageSewerageSeries = [];

  billingElectricitySeriesColors = [];
  billingWaterSeriesColors = [];
  billingSewerageSeriesColors = [];

  public commonBarChartOptions: Partial<ChartOptions>;
  public commonUsageBarChartOptions: Partial<ChartOptions>;
  public commonLineChartOptions: Partial<LineChartOptions>;
  public commonLineUsageChartOptions: Partial<LineChartOptions>;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private service: DashboardService,
    private _cdr: ChangeDetectorRef,
    private _utils: UmfaUtils
  ) { 
    this.treeMapOptions = {
      series: [
      ],
      legend: {
        show: false
      },
      chart: {
        type: "treemap",
        toolbar: {
          show: false
        }
      },
      title: {
        text: "",
        align: "center"
      },
      colors: [
      ],
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false
        }
      }
    };
    this.commonBarChartOptions = {
      series: [],
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yaxis: {
        labels: {
          formatter: function(val) {
            return 'R ' + val;
          } 
        }
      },
      fill: {
        opacity: 1,
        colors: []
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return 'R ' + val;
          }
        }
      }
    };
    this.commonUsageBarChartOptions = {
      series: [],
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yaxis: {
        labels: {
          formatter: function(val) {
            return '' + val;
          } 
        }
      },
      fill: {
        opacity: 1,
        colors: []
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return '' + val;
          }
        }
      }
    };
    this.commonLineChartOptions = {
      series: [
      ],
      chart: {
        height: 350,
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
        size: 4
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yaxis: {
        labels: {
          formatter: function(val) {
            return 'R ' + val;
          } 
        }
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return 'R ' + Math.round(Number(val) * 100) / 100;
          }
        }
      }
    };
    this.commonLineUsageChartOptions = {
      series: [
      ],
      chart: {
        height: 350,
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
        size: 4
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yaxis: {
        labels: {
          formatter: function(val) {
            return '' + val;
          } 
        }
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return 'R ' + Math.round(Number(val) * 100) / 100;
          }
        }
      }
    };
  }

  ngOnInit(): void {
    this.service.setTitle('Tenant Dashboard');

    this.service.tenantDetail$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          this.tenantDetailDashboard = res;
          if(this.tenantDetailDashboard['BillingData'].length > 0) {
            this.lastPeriodName = this.tenantDetailDashboard['BillingData'][this.tenantDetailDashboard['BillingData'].length - 1]['PeriodName'];
            this.lastPeriodBillings = this.tenantDetailDashboard['BillingData'].filter(item => item['PeriodName'] == this.lastPeriodName);
            this.billingTotal = this.lastPeriodBillings.reduce((prev, cur) => prev + cur.Amount, 0);
            this.allAvailableImages = this.tenantDetailDashboard.ReadingsInfo.reduce((prev, cur) => prev + cur.HasImages, 0);
            this.tenantDetailDashboard.Shops.forEach(shop => {
              let result = {value: shop.ShopID, item: shop};
              this.shopListItems.push(result);
            })
            this.groupList = []; this.periodList = []; this.yearList = [];this.utilityList = [];
            this.tenantDetailDashboard.BillingData.forEach(billing => {
              this.groupList.push(billing.GroupName.trim());
              this.periodList.push(billing.PeriodName);
              this.yearList.push(billing.PeriodName.split(' ')[1]);
              if(!this.periodItemList.find(obj => obj['id'] == billing.PeriodID)) {
                this.periodItemList.push({id: billing.PeriodID, name: billing.PeriodName});
              }
              this.utilityList.push(billing.Utility.trim());
            });
            this.groupList = this.groupList.filter(this.onlyUnique);
            this.periodList = this.periodList.filter(this.onlyUnique);
            this.yearList = this.yearList.filter(this.onlyUnique);
            this.utilityList =  this.utilityList.filter(this.onlyUnique);
            let lastMonth = this.tenantDetailDashboard.BillingData[this.tenantDetailDashboard.BillingData.length - 1]['PeriodName'].split(' ')[0];
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

            this.commonBarChartOptions.xaxis.categories = this.monthAbbrList;
            this.commonLineChartOptions.xaxis.categories = this.monthAbbrList;

            this.utilityList.forEach(utility => {
              this.groupsByUtility[utility] = [];
              let filteredBillings = this.tenantDetailDashboard.BillingData.filter(billing => billing['Utility'] == utility);
              filteredBillings.forEach(billing => {
                if(this.groupsByUtility[utility].indexOf(billing['GroupName'].trim()) == -1) this.groupsByUtility[utility].push(billing['GroupName'].trim());
              })
            })

            this.billingElectricitySeriesColors = this._utils.utilityColorMapping()['Electricity'].slice(0, this.yearList.length).reverse();
            this.billingWaterSeriesColors = this._utils.utilityColorMapping()['Water'].slice(0, this.yearList.length).reverse();
            this.billingSewerageSeriesColors = this._utils.utilityColorMapping()['Sewerage'].slice(0, this.yearList.length).reverse();

            this.billingPeriodList = this.periodList.map(period => {
              return {name:period, value: period}
            }).reverse();
            this.selectedMonth = this.billingPeriodList[0]['value'];
            this.setBillingSummary();

            this.setSeriesForBillingChart();

            this._cdr.detectChanges();
          }
        }
      });
  }

  setBillingSummary() {
    
    let billingSummaryData = [];
    this.billingSummaryDataSource = [];
    
    Object.keys(this.groupsByUtility).forEach(key => {
      this.groupsByUtility[key].forEach(groupName => {
        let groupData = [];
        let groupUsageData = [];
        groupData.push(this.tenantDetailDashboard.BillingData
                              .filter(period => period.PeriodName == this.selectedMonth && period.GroupName.trim() == groupName)
                              .reduce((prev, cur) => prev + cur.Amount, 0));
        groupUsageData.push(this.tenantDetailDashboard.BillingData
          .filter(period => period.PeriodName == this.selectedMonth && period.GroupName.trim() == groupName)
          .reduce((prev, cur) => prev + cur.Usage, 0));

        let totalByGroup = groupData.reduce((prev, cur) => prev + cur, 0);
        let totalUsageByGroup = groupUsageData.reduce((prev, cur) => prev + cur, 0);

        billingSummaryData.push({x: groupName, y: totalByGroup});
        this.billingSummaryDataSource.push({name: groupName, amount: totalByGroup, usage: totalUsageByGroup});
      })
    })

    this.treeMapOptions.colors = this._utils.getColors(this.groupsByUtility);
    this.treeMapOptions.series = [];
    this.treeMapOptions.series.push({'data': billingSummaryData});

  }

  onBillingMonthChange(event) {
    this.setBillingSummary();
  }

  setSeriesForBillingChart() {
    let billingElectricitySeries = []; 
    let billingUsageElectricitySeries = [];
    let billingWaterSeries = [];
    let billingUsageWaterSeries = [];
    let billingSewerageSeries = [];
    let billingUsageSewerageSeries = [];

    this.yearList.forEach(year => {
      billingElectricitySeries.push({name: year, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]});
      billingUsageElectricitySeries.push({name: year, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]});
      billingWaterSeries.push({name: year, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]});
      billingUsageWaterSeries.push({name: year, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]});
      billingSewerageSeries.push({name: year, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]});
      billingUsageSewerageSeries.push({name: year, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]});
    });

    this.tenantDetailDashboard.BillingData.forEach(billing => {
      let year = billing['PeriodName'].split(' ')[1];
      let month = billing['PeriodName'].split(' ')[0];
      let idx = billingElectricitySeries.findIndex(obj => obj['name'] == year);
      let monthIdx = this.monthNameList.indexOf(month);
      if(billing['Utility'] == 'Electricity') {        
        billingElectricitySeries[idx]['data'][monthIdx] += billing['Amount'];
        billingUsageElectricitySeries[idx]['data'][monthIdx] += billing['Usage'];
      }
      if(billing['Utility'] == 'Water') {
        billingWaterSeries[idx]['data'][monthIdx] += billing['Amount'];
        billingUsageWaterSeries[idx]['data'][monthIdx] += billing['Usage'];
      }
      if(billing['Utility'] == 'Sewerage') {
        billingSewerageSeries[idx]['data'][monthIdx] += billing['Amount'];
        billingUsageSewerageSeries[idx]['data'][monthIdx] += billing['Usage'];
      }
    });
    this.billingElectricitySeries = billingElectricitySeries;
    this.billingUsageElectricitySeries = billingUsageElectricitySeries;
    this.billingWaterSeries = billingWaterSeries;
    this.billingUsageWaterSeries = billingUsageWaterSeries;
    this.billingSewerageSeries = billingSewerageSeries;
    this.billingUsageSewerageSeries = billingUsageSewerageSeries;

  }

  onChangeShop(event) {
    this.service.getTenantDashboardDetail(this.buildingId, this.tenantId, event.value, this.includeVacant).subscribe();
  }

  onIncludeVacantChange(event) {
    this.service.getTenantDashboardDetail(this.buildingId, this.tenantId, this.selectedShop, event.checked).subscribe();
  }

  onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

  showBillingDetail() {
    let period = this.periodItemList.find(period => period['name'] == this.selectedMonth);
    this.service.showTenantBillingDetail({buildingId: this.buildingId, tenantId: this.tenantId, periodId: period['id'], tenantName: this.tenantName});
  }

  getColorFromGroupName(groupName) {
    let color = '';
    Object.keys(this.groupsByUtility).forEach(key => {
      let groups = this.groupsByUtility[key];
      if(groups.indexOf(groupName) > -1) color = this._utils.utilityColorMapping()[key][groups.indexOf(groupName)];
    })
    return color;
  }

  onTenantBilling() {
    this.service.showTenantBilling({buildingId: this.buildingId, tenantId: this.tenantId});
  }

  /**
     * On destroy
     */
  ngOnDestroy(): void
  {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    this.service.destroyTenantDetail();
  }
}
