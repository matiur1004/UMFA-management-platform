import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AllowedPageSizes } from '@core/helpers';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../dasboard.service';
import moment from 'moment';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
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
  selector: 'app-tenant-readings',
  templateUrl: './tenant-readings.component.html',
  styleUrls: ['./tenant-readings.component.scss']
})
export class TenantReadingsComponent implements OnInit {

  @Input() shopId;
  @Input() buildingId;
  @Input() meterId;

  dataSource: any;
  applyFilterTypes: any;
  currentFilter: any;
  meters: any;
  metersDataSource: DataSource;

  form: UntypedFormGroup;
  yearList: any[] = [];
  reverseYearList: any[] = [];

  initMonthNameList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  initMonthAbbrList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  monthNameList = [];
  monthAbbrList = [];

  billingChartType = 'Bar';
  lineUsageChartSeries: any = {};
  public barChartOptions: Partial<BarChartOptions>;
  public lineUsageChartOptions: Partial<LineChartOptions>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  readonly allowedPageSizes = AllowedPageSizes;
  
  constructor(
    private dashboardService: DashboardService,
    private _formBuilder: UntypedFormBuilder,
    private _cdr: ChangeDetectorRef,
    private _utils: UmfaUtils,
  ) {
    this.applyFilterTypes = [{
        key: 'auto',
        name: 'Immediately',
    }, {
        key: 'onClick',
        name: 'On Button Click',
    }];
    this.currentFilter = this.applyFilterTypes[0].key;
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
            return '' + val;
          } 
        }
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
        labels: {
          formatter: function(val) {
            return '' + val;
          } 
        }
      },
    };
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      meterId: [null],
    })
    this.dashboardService.metersForBuilding$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          this.metersDataSource = new DataSource({
            store: new ArrayStore({
              data: res,
              key: 'BuildingServiceID',
            }),
            group: 'Direct',
          });
          this.meters = res;
        }
      });

    this.dashboardService.tenantReadingsDashboard$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          let meter = this.meters.find(obj => obj['BuildingServiceID'] == this.form.get('meterId').value);
          let utility = meter['Utility'];
          this.dataSource = res.map(item => {
            return {...item, Contribution: Math.round(item['Contribution'] * 10000) / 100 + ' %'}
          });

          res.map(item => {
            if(!this.yearList.find(year => year == item['PeriodName'].split(' ')[1])) {
              this.yearList.push(item['PeriodName'].split(' ')[1]);
            }
          });

          this.reverseYearList = this.yearList.reverse();
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
          });

          this.lineUsageChartOptions.xaxis.categories = this.monthAbbrList;

          this.barChartOptions.colors = this._utils.utilityColorMapping()[utility].slice(0, 2);

          this.setChart();

          this._cdr.detectChanges();
        }
      });

    if(this.meterId) {
      this.form.get("meterId").setValue(this.meterId);
      this.dashboardService.getTenantBillingsByMeter(this.form.get('meterId').value, this.shopId, this.buildingId).subscribe();
    }
  }

  setChart() {
    let billingBarSeriesData = [];
    ['Actual', 'Estimated'].forEach(type => {
      let result = {name: type, data: []};
      this.monthNameList.forEach(month => {
        this.yearList.forEach(year => {
          let filter = this.dataSource.find(item => item['PeriodName'] == `${month} ${year}` && item['Estimated'] == (type == 'Actual' ? false : true));
          if(filter) result['data'].push({x: '`' + year.split('20')[1], y: filter['BillingUsage']});
           else result['data'].push({x: '`' + year.split('20')[1], y: 0});
        });
      });
      billingBarSeriesData.push(result);
    })

    this.yearList.forEach(year => {
      let usageLineSeriesData = [];
      ['Actual', 'Estimated'].forEach(type => {
        let usageLineResult = {name: type, data: []};
        this.monthNameList.forEach(month => {
          let filter = this.dataSource.find(item => item['PeriodName'] == `${month} ${year}` && item['Estimated'] == (type == 'Actual' ? false : true));
          if(filter) { usageLineResult['data'].push(filter['BillingUsage']);}
          else { usageLineResult['data'].push(0);}
        })
        usageLineSeriesData.push(usageLineResult);
      });
      this.lineUsageChartSeries[year] = usageLineSeriesData;
    });
    this.barChartOptions.series = billingBarSeriesData;
  }

  lineChartYearChange() {
    window.dispatchEvent(new Event('resize'));
  }

  onCustomizeDate(cellInfo) {
    if(!cellInfo.value) return 'N/A';
    return moment(new Date(cellInfo.value)).format('DD/MM/YYYY');
  }
  
  meterChanged(event) {
    this.dashboardService.getTenantBillingsByMeter(this.form.get('meterId').value, this.shopId, this.buildingId).subscribe();
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
