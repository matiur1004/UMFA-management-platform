import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';
import moment from 'moment';

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

  @Input() shopDetail: any;

  selectedMonth;

  groupColors = {
    'C/A Diesel' : '#008E0E',
    'C/A Electricity': '#452AEB',
    'C/A Sewer': '#2FAFB7',
    'C/A Water': '#C23BC4',
    'Kwh Electricity': '#6E6E6E',
    'Kva': '#16a34a',
    'Sewer': '#C24F19',
    'Water': '#C8166C',
    'Common Area Elec': '#84cc16',
    'Common Area Sewer': '#06b6d4',
    'Common Area Water': '#8b5cf6'
  };
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

  // {
  //   value: 4470800,
  //   name: 'Ankara',
  //   country: 'Turkey',
  // }, {
  dataSource: any;
  shopDetailDashboard: any;
  billingTotal: number;
  allAvailableImages: number;

  tenantItems: any[] = [];
  selectedTenantType: string = 'latest';
  periodList: any[] = [];
  billingPeriodList: any[] = [];
  groupList: any[] = [];
  periodLengthItems = [{name: '12 months', value: 12}, {name: '24 months', value: 24}, {name: '36 months', value: 36}];
  billingGroupItems = [];
  selectedPeriodLengthForBilling = 36;
  selectedGroupsForBilling;
  selectedGroupsForBillingUsage;

  public billingChartOptions: Partial<ChartOptions>;
  public billingUsageChartOptions: Partial<ChartOptions>;
  public treeMapOptions: Partial<TreemapChartOptions>;
  
  @ViewChild("treemapChart") chart: ChartComponent;
  @ViewChild("billingChart") billingChart: ChartComponent;
  @ViewChild("billingUsageChart") billingUsageChart: ChartComponent;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private service: DashboardService
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
    this.billingChartOptions = {
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
            return 'R ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  }

  ngOnInit(): void {

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
          this.periodList = this.shopDetailDashboard.PeriodBillings.map(billing => billing.PeriodName).filter(this.onlyUnique);
          this.groupList = this.shopDetailDashboard.PeriodBillings.map(billing => billing.GroupName.trim()).filter(this.onlyUnique);
          
          this.billingPeriodList = this.periodList.map(period => {
            return {name:period, value: period}
          }).reverse();
          this.selectedMonth = this.billingPeriodList[0]['value'];

          this.billingGroupItems = [{Id: '0', Name: 'All', expanded: true}];
          let selectedValue = ['0'];
          this.groupList.map(groupName => {
            let item = {Id: groupName, Name: groupName, categoryId: '0'};
            selectedValue.push(groupName);
            this.billingGroupItems.push(item);
          })
          this.selectedGroupsForBilling = selectedValue;
          this.selectedGroupsForBillingUsage = selectedValue;
          this.setBillingChart()
          this.setBillingUsageChart();

          this.availableGroupColors = this.groupList.map(groupName => this.groupColors[groupName]);

          this.billingChartOptions.colors = this.availableGroupColors;
          this.billingChartOptions.fill.colors = this.availableGroupColors;

          this.billingUsageChartOptions.colors = this.availableGroupColors;
          this.billingUsageChartOptions.fill.colors = this.availableGroupColors;

          this.setBillingSummary();
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

  onTreeViewReady(event, type) {
    event.component.selectAll();
    if(type == 'billing') this.selectedGroupsForBilling = event.component.getSelectedNodeKeys();
    else this.selectedGroupsForBillingUsage = event.component.getSelectedNodeKeys();
  }
  
  onInitialized(event) {
    event.component.selectAll();
  }

  onTreeViewSelectionChanged(event, type) {
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

    if(type == 'billing') {
      this.selectedGroupsForBilling = event.component.getSelectedNodeKeys();
      this.setBillingChart();
    } else {
      this.selectedGroupsForBillingUsage = event.component.getSelectedNodeKeys();
      this.setBillingUsageChart();
    }
    
  }

  setBillingChart() {
    let billingData = [];
    let periodArray = this.periodList.slice(-this.selectedPeriodLengthForBilling);
    this.selectedGroupsForBilling.forEach(groupName => {
      if(groupName == '0') return;
      let groupData = {name: groupName, data: []};
      periodArray.forEach(periodName => {
        groupData['data'].push(this.shopDetailDashboard.PeriodBillings
          .filter(period => period.PeriodName == periodName && period.GroupName.trim() == groupName)
          .reduce((prev, cur) => prev + cur.Amount, 0));
      });

      billingData.push(groupData);
    })
    
    let groupColors = this.selectedGroupsForBilling.filter(groupName => groupName != '0').map(groupName => this.groupColors[groupName]);
    this.billingChartOptions.colors = groupColors;
    this.billingChartOptions.fill.colors = groupColors;
    
    this.billingChartOptions.xaxis.categories = periodArray.map(period => moment(new Date(period)).format('MMM YY'));
    this.billingChartOptions.series = billingData;
    if(this.billingChart) this.billingChart.ngOnInit();
  }

  setBillingUsageChart() {
    let billingUsageData = [];
    let periodArray = this.periodList.slice(-this.selectedPeriodLengthForBilling);
    this.selectedGroupsForBillingUsage.forEach(groupName => {
      if(groupName == '0') return;
      let groupUsageData = {name: groupName, data: []};
      periodArray.forEach(periodName => {

        groupUsageData['data'].push(this.shopDetailDashboard.PeriodBillings
          .filter(period => period.PeriodName == periodName && period.GroupName.trim() == groupName)
          .reduce((prev, cur) => prev + cur.Usage, 0));
      });

      billingUsageData.push(groupUsageData);
    })
    
    let groupColors = this.selectedGroupsForBillingUsage.filter(groupName => groupName != '0').map(groupName => this.groupColors[groupName]);
    
    this.billingUsageChartOptions.xaxis.categories = periodArray.map(period => moment(new Date(period)).format('MMM YY'));
    this.billingUsageChartOptions.series = billingUsageData;

    this.billingUsageChartOptions.colors = groupColors;
    this.billingUsageChartOptions.fill.colors = groupColors;
    
    if(this.billingUsageChart) this.billingUsageChart.ngOnInit();
  }

  setBillingSummary() {
    this.treeMapOptions.colors = this.availableGroupColors;
    let billingSummaryData = [];
    this.billingSummaryDataSource = [];
    this.treeMapOptions.series = [];
    this.groupList.forEach(groupName => {
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
    })
    this.treeMapOptions.series.push({'data': billingSummaryData});
    if(this.chart) this.chart.ngOnInit();
  }

  onBillingMonthChange(event) {
    this.setBillingSummary();
  }

  onPeriodLengthChange(type) {
    if(type == 'billing') {
      this.setBillingChart();
    } else {
      this.setBillingUsageChart();
    }
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
