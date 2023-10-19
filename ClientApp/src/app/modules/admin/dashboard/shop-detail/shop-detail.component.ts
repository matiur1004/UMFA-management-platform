import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';
import moment from 'moment';
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
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.scss']
})
export class ShopDetailComponent implements OnInit {

  @Input() buildingId: number;
  @Input() shopId: number;
  selectedMonth;
  monthNameList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentYear = new Date().getFullYear();
  yearList = [];
  // groupColors = {
  //   'C/A Diesel' : '#008E0E',
  //   'C/A Electricity': '#452AEB',
  //   'C/A Sewer': '#2FAFB7',
  //   'C/A Water': '#C23BC4',
  //   'Kwh Electricity': '#6E6E6E',
  //   'Kva': '#16a34a',
  //   'Sewer': '#C24F19',
  //   'Water': '#C8166C',
  //   'Common Area Elec': '#84cc16',
  //   'Common Area Sewer': '#06b6d4',
  //   'Common Area Water': '#8b5cf6',
  //   'Diesel Generator': '#f59e0b',
  //   'KVA Electricity': '#6b21a8',
  //   'KWH Electricity': '#9f1239',
  //   'E-Kwh': '#d946ef',
  //   'Diesel Recoveries': '#a855f7'
  // };
  groupColors = ['#008E0E', '#452AEB', '#2FAFB7', '#C23BC4', '#6E6E6E', '#46a34a', '#C24F19', '#C8166C', '#84cc16', '#06b6d4', '#8b5cf6', '#f59e0b', '#6b21a8', '#9f1239', '#d946ef', '#a855f7'];
  availableGroupColors: any;

  mapOptions = {
    type: 'discrete',
    palette: [],
  };

  billingSummaryMap: any[] = [{
    name: '',
    items: []
  }]
  billingSummaryDataSource: any;

  dataSource: any;
  shopDetailDashboard: any;
  billingTotal: number;
  allAvailableImages: number;

  tenantItems: any[] = [];
  periodList: any[] = [];
  billingPeriodList: any[] = [];
  groupList: any[] = [];
  periodLengthItems = [{name: '12 months', value: 12}, {name: '24 months', value: 24}, {name: '36 months', value: 36}];
  billingGroupItems = [];
  selectedPeriodLengthForBilling = 36;
  selectedGroupsForBilling;
  selectedGroupsForBillingUsage;

  groupsByUtility: any = {};
  utilityList: any[] = [];

  public billingUsageChartOptions: Partial<ChartOptions>;
  public treeMapOptions: Partial<TreemapChartOptions>;
  
  public commonBarChartOptions: Partial<ChartOptions>;
  public commonLineChartOptions: Partial<LineChartOptions>;

  @ViewChild("treemapChart") chart: ChartComponent;
  @ViewChild("billingChart") billingChart: ChartComponent;
  @ViewChild("billingUsageChart") billingUsageChart: ChartComponent;

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

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private service: DashboardService,
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
    this.billingUsageChartOptions = {
      series: [],
      chart: {
        type: "bar",
        height: 350
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
        categories: []
      },
      yaxis: {
        labels: {
          formatter: function(val) {
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
            return val + "";
          }
        }
      }
    }
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
    }
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
  }

  ngOnInit(): void {
    this.service.setTitle('Shop Dashboard');
    this.service.shopDetail$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          this.shopDetailDashboard = res;
          this.billingTotal = this.shopDetailDashboard.LatestPeriodBillings.reduce((prev, cur) => prev + cur.Amount, 0);
          this.tenantItems = [
            {value: 'latest', label: this.shopDetailDashboard.Occupations[0]['LastTenantName']},
            {value: 'all', label: 'All'}
          ];
          this.allAvailableImages = this.shopDetailDashboard.Readings.reduce((prev, cur) => prev + cur.HasImages, 0);
          this.groupList = []; this.periodList = []; this.yearList = []; this.utilityList = [];
          this.shopDetailDashboard.PeriodBillings.forEach(billing => {
            this.groupList.push(billing.GroupName.trim());
            this.periodList.push(billing.PeriodName);
            this.yearList.push(billing.PeriodName.split(' ')[1]);
            this.utilityList.push(billing.Utility.trim());
          });

          this.groupList = this.groupList.filter(this.onlyUnique);
          this.periodList = this.periodList.filter(this.onlyUnique);
          this.yearList = this.yearList.filter(this.onlyUnique);
          this.utilityList =  this.utilityList.filter(this.onlyUnique);
          
          this.utilityList.forEach(utility => {
            this.groupsByUtility[utility] = [];
            let filteredBillings = this.shopDetailDashboard.PeriodBillings.filter(billing => billing['Utility'] == utility);
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
        }
      });
  }

  customizeTooltip(arg) {
    const data = arg.node.data;
    let result = null;

    if (arg.node.isLeaf()) {
      result = `<span class='city'>${data.name}</span> <br/>Amount: ${arg.valueText}`;
    }

    return {
      text: result,
    };
  }

  onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
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

    this.shopDetailDashboard.PeriodBillings.forEach(billing => {
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

  setBillingSummary() {
    this.treeMapOptions.colors = this.availableGroupColors;
    let billingSummaryData = [];
    this.billingSummaryDataSource = [];
    this.treeMapOptions.series = [];
    Object.keys(this.groupsByUtility).forEach(key => {
      this.groupsByUtility[key].forEach(groupName => {
        let groupData = [];
        let groupUsageData = [];
        groupData.push(this.shopDetailDashboard.PeriodBillings
                              .filter(period => period.PeriodName == this.selectedMonth && period.GroupName.trim() == groupName)
                              .reduce((prev, cur) => prev + cur.Amount, 0));
        groupUsageData.push(this.shopDetailDashboard.PeriodBillings
          .filter(period => period.PeriodName == this.selectedMonth && period.GroupName.trim() == groupName)
          .reduce((prev, cur) => prev + cur.Usage, 0));

        let totalByGroup = groupData.reduce((prev, cur) => prev + cur, 0);
        let totalUsageByGroup = groupUsageData.reduce((prev, cur) => prev + cur, 0);

        billingSummaryData.push({x: groupName, y: totalByGroup});
        this.billingSummaryDataSource.push({name: groupName, amount: totalByGroup, usage: totalUsageByGroup});
      });
    });
    this.treeMapOptions.colors = this._utils.getColors(this.groupsByUtility);
    this.treeMapOptions.series.push({'data': billingSummaryData});
    //if(this.chart) this.chart.ngOnInit();
  }

  onBillingMonthChange(event) {
    this.setBillingSummary();
  }

  onShopBilling() {
    this.service.showShopBilling({buildingId: this.buildingId, shopId: this.shopId});
  }

  onShopOccupation() {
    this.service.showShopOccupation({buildingId: this.buildingId, shopId: this.shopId});
  }
  
  onShopAssignedMeters() {
    this.service.showAssignedMeters({buildingId: this.buildingId, shopId: this.shopId});
  }

  onShopReadings() {
    this.service.showReadings({buildingId: this.buildingId, shopId: this.shopId, meterId: null});
  }

  getColorFromGroupName(groupName) {
    let color = '';
    Object.keys(this.groupsByUtility).forEach(key => {
      let groups = this.groupsByUtility[key];
      if(groups.indexOf(groupName) > -1) color = this._utils.utilityColorMapping()[key][groups.indexOf(groupName)];
    })
    return color;
  }

  /**
     * On destroy
     */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
      this.service.destroyShopDetail();
  }
}
