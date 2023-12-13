import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
  ApexYAxis
} from "ng-apexcharts";
import moment from 'moment';
import { UmfaUtils } from '@core/utils/umfa.utils';
import { DatePipe } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  fill: ApexFill;
};

export enum PeriodType {
  All, Day, Week, Month, Year
}
@Component({
  selector: 'app-smart-building-detail',
  templateUrl: './smart-building-detail.component.html',
  styleUrls: ['./smart-building-detail.component.scss']
})
export class SmartBuildingDetailComponent implements OnInit {

  @Input() buildingId: number;

  electricityDetail: any;
  waterDetail: any;

  electricityConsumptionXAxis: ApexXAxis = {type: "category", categories: []};
  waterConsumptionXAxis: ApexXAxis = {type: "category", categories: []};

  weeksAbbr= ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  monthsAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  electricityConsumptionColors = [];
  waterConsumptionColors = [];

  electricityConsumptionSeries: any = {series: []};
  waterConsumptionSeries: any = {series: []};

  periodOfElectricity: any;
  periodOfWater: any;

  electricityProfileDatasource: any;
  waterProfileDatasource: any;

  public electricityConsumptionBarChartOptions: Partial<ChartOptions>;
  public waterConsumptionBarChartOptions: Partial<ChartOptions>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _service: DashboardService,
    private _utils: UmfaUtils,
    private _cdr: ChangeDetectorRef
  ) { 
    this.electricityConsumptionBarChartOptions = {
      series: [],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "category",
        labels: {
          hideOverlappingLabels: false,
          style: {
            fontSize: '11px'
          },
        },
        
        categories: [
        ]
      },
      yaxis: {
        labels: {
          formatter: function(val) {
            return val.toFixed(2);
          } 
        }
      },
      legend: {
        position: "bottom",
        horizontalAlign: 'center',
        show: true,
        showForSingleSeries: true,
      },
      fill: {
        opacity: 1
      },
    };
    this.waterConsumptionBarChartOptions = {
      series: [],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "category",
        labels: {
          hideOverlappingLabels: false,
          style: {
            fontSize: '11px'
          },
        },
        
        categories: [
        ]
      },
      yaxis: {
        labels: {
          formatter: function(val) {
            return val.toFixed(2);
          } 
        }
      },
      legend: {
        position: "bottom",
        horizontalAlign: 'center', 
        show: true,
        showForSingleSeries: true,
      },
      fill: {
        opacity: 1
      },
    };
  }

  ngOnInit(): void {
    this._service.smartBuildingElectricity$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          console.log(res, 'electricity');
          this.electricityDetail = res;
          this.setGraphForConsumption('electricity');
          this.setGraphForProfile('electricity');
          this._cdr.detectChanges();
        }
      })

    this._service.smartBuildingWater$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          console.log(res, 'water');
          this.waterDetail = res;
          this.setGraphForConsumption('water');
          this.setGraphForProfile('water');
          this._cdr.detectChanges();
        }
      })
  }

  setGraphForProfile(type) {
    var pipe = new DatePipe('en_ZA');
    if(type == 'electricity') {
      let endIdx = 0;
      this.electricityDetail['ProfileData'].forEach((obj, idx) => {
        if(idx > 0 && obj['ReadingDate'] == this.electricityDetail['ProfileData'][0]['ReadingDate'] && endIdx == 0) endIdx = idx;
      })

      this.electricityProfileDatasource = this.electricityDetail['ProfileData'].slice(0, endIdx - 1);
      this.electricityProfileDatasource = this.electricityProfileDatasource.map(obj => {
        return {...obj, ReadingDateString: pipe.transform(obj.ReadingDate, "yyyy-MM-dd HH:mm")};
      })
    } else {
      let endIdx = 0;
      this.waterDetail['ProfileData'].forEach((obj, idx) => {
        if(idx > 0 && obj['ReadingDate'] == this.waterDetail['ProfileData'][0]['ReadingDate'] && endIdx == 0) endIdx = idx;
      })
      console.log('endIdx', endIdx)
      //Usage
      this.waterProfileDatasource = this.waterDetail['ProfileData'].slice(0, endIdx - 1);
      this.waterProfileDatasource = this.waterProfileDatasource.map(obj => {
        return {...obj, ReadingDateString: pipe.transform(obj.ReadingDate, "yyyy-MM-dd HH:mm")};
      })
    }
  }
  
  customizeTooltip(arg: any) {
    var ret = { text: `<strong>Name:</strong> ${arg.seriesName} <br> <strong>Value:</strong> ${arg.valueText} <br> <strong>Date and Time:</strong> ${arg.argument}` };
    return ret;
  }

  setGraphForConsumption(type) {
    if(type == 'electricity') {
      let locationsArray = [];
      this.electricityDetail['Consumptions'].forEach(item => {
        if(locationsArray.indexOf(item['SupplyToLocationName']) == -1) locationsArray.push(item['SupplyToLocationName']);
      })
      this.electricityConsumptionColors = this._utils.utilityColorMapping()['Electricity'].slice(0, locationsArray.length).reverse();
      if(this.periodOfElectricity['periodType'] == PeriodType.Month) {
        this.electricityConsumptionBarChartOptions.xaxis.categories = [];
        for (let i = moment(this.periodOfElectricity['startDate']).toDate().getDate(); i <= moment(this.periodOfElectricity['endDate']).toDate().getDate(); i++) {
          let day = moment(this.periodOfElectricity['startDate']).add(i - 1, 'days').toDate().getDay();
          this.electricityConsumptionBarChartOptions.xaxis.categories.push([i.toString(), this.weeksAbbr[day]]);
        }
        
        this.electricityConsumptionBarChartOptions.series = [];
        locationsArray.forEach(locationName => {
          let result = {name: locationName, data: []};
          this.electricityConsumptionBarChartOptions.xaxis.categories.forEach(val => result['data'].push(0));
          
          let filteredByLocation = this.electricityDetail['Consumptions'].filter(obj => obj['SupplyToLocationName'] == locationName);
          filteredByLocation.forEach(item => {
            result['data'][item['Day'] - 1] = item['Energy'];
          })
          this.electricityConsumptionBarChartOptions.series.push(result);
        })
      } else if(this.periodOfElectricity['periodType'] == PeriodType.Week) {
        this.electricityConsumptionBarChartOptions.xaxis.categories = [];
        for (let i = 0; i <= 6 ; i++) {
          let date = moment(this.periodOfElectricity['startDate']).add(i, 'days').toDate()
          this.electricityConsumptionBarChartOptions.xaxis.categories.push(date.getDate() + '/' + (date.getMonth() + 1));
        }

        this.electricityConsumptionBarChartOptions.series = [];
        locationsArray.forEach(locationName => {
          let result = {name: locationName, data: []};
          this.electricityConsumptionBarChartOptions.xaxis.categories.forEach(val => result['data'].push(0));
          
          let filteredByLocation = this.electricityDetail['Consumptions'].filter(obj => obj['SupplyToLocationName'] == locationName);
          this.electricityConsumptionBarChartOptions.xaxis.categories.forEach((val, idx) => {
            let month = val.split('/')[1];
            let day = val.split('/')[0];
            let filteredByDate = filteredByLocation.find(obj => obj['Day'] == day && obj['Month'] == month);
            if(filteredByDate) result['data'][idx] = filteredByDate['Energy'];
          })
          this.electricityConsumptionBarChartOptions.series.push(result);
        })
      } else if(this.periodOfElectricity['periodType'] == PeriodType.Year) {
        this.electricityConsumptionBarChartOptions.xaxis.categories = this.monthsAbbr;

        this.electricityConsumptionBarChartOptions.series = [];
        locationsArray.forEach(locationName => {
          let result = {name: locationName, data: []};
          this.electricityConsumptionBarChartOptions.xaxis.categories.forEach(val => result['data'].push(0));
          
          let filteredByLocation = this.electricityDetail['Consumptions'].filter(obj => obj['SupplyToLocationName'] == locationName);
          this.electricityConsumptionBarChartOptions.xaxis.categories.forEach((val, idx) => {
            let filteredByDate = filteredByLocation.find(obj => obj['Month'] == (idx + 1));
            if(filteredByDate) result['data'][idx] = filteredByDate['Energy'];
          })
          this.electricityConsumptionBarChartOptions.series.push(result);
        })
      } else if(this.periodOfElectricity['periodType'] == PeriodType.Day) {
        this.electricityConsumptionBarChartOptions.xaxis.categories = [];
        let date = moment(this.periodOfElectricity['startDate']).toDate();
        this.electricityConsumptionBarChartOptions.xaxis.categories.push(date.getDate() + '/' + (date.getMonth() + 1));

        this.electricityConsumptionBarChartOptions.series = [];
        locationsArray.forEach(locationName => {
          let result = {name: locationName, data: []};
          this.electricityConsumptionBarChartOptions.xaxis.categories.forEach(val => result['data'].push(0));
          
          let filteredByLocation = this.electricityDetail['Consumptions'].find(obj => obj['SupplyToLocationName'] == locationName);
          if(filteredByLocation) result['data'] = [filteredByLocation['Energy']];

          this.electricityConsumptionBarChartOptions.series.push(result);
        })
      }
      this._cdr.detectChanges();
    } else {
      let locationsArray = [];
      this.waterDetail['Consumptions'].forEach(item => {
        if(locationsArray.indexOf(item['SupplyToLocationName']) == -1) locationsArray.push(item['SupplyToLocationName']);
      })

      this.waterConsumptionColors = this._utils.utilityColorMapping()['Water'].slice(0, locationsArray.length).reverse();
      if(this.periodOfWater['periodType'] == PeriodType.Month) {
        this.waterConsumptionBarChartOptions.xaxis.categories = [];
        for (let i = moment(this.periodOfWater['startDate']).toDate().getDate(); i <= moment(this.periodOfWater['endDate']).toDate().getDate(); i++) {
          let day = moment(this.periodOfWater['startDate']).add(i - 1, 'days').toDate().getDay();
          this.waterConsumptionBarChartOptions.xaxis.categories.push([i.toString(), this.weeksAbbr[day]]);
        }

        this.waterConsumptionBarChartOptions.series = [];
        locationsArray.forEach(locationName => {
          let result = {name: locationName, data: []};
          this.waterConsumptionBarChartOptions.xaxis.categories.forEach(val => result['data'].push(0));
          
          let filteredByLocation = this.waterDetail['Consumptions'].filter(obj => obj['SupplyToLocationName'] == locationName);
          filteredByLocation.forEach(item => {
            result['data'][item['Day'] - 1] = item['Usage'];
          })
          this.waterConsumptionBarChartOptions.series.push(result);
        })
      } else if(this.periodOfWater['periodType'] == PeriodType.Week) {
        this.waterConsumptionBarChartOptions.xaxis.categories = [];
        for (let i = 0; i <= 6 ; i++) {
          let date = moment(this.periodOfWater['startDate']).add(i, 'days').toDate()
          this.waterConsumptionBarChartOptions.xaxis.categories.push(date.getDate() + '/' + (date.getMonth() + 1));
        }

        this.waterConsumptionBarChartOptions.series = [];
        locationsArray.forEach(locationName => {
          let result = {name: locationName, data: []};
          this.waterConsumptionBarChartOptions.xaxis.categories.forEach(val => result['data'].push(0));
          
          let filteredByLocation = this.waterDetail['Consumptions'].filter(obj => obj['SupplyToLocationName'] == locationName);
          this.waterConsumptionBarChartOptions.xaxis.categories.forEach((val, idx) => {
            let month = val.split('/')[1];
            let day = val.split('/')[0];
            let filteredByDate = filteredByLocation.find(obj => obj['Day'] == day && obj['Month'] == month);
            if(filteredByDate) result['data'][idx] = filteredByDate['Usage'];
          })
          this.waterConsumptionBarChartOptions.series.push(result);
        })
        console.log(this.waterConsumptionBarChartOptions)
      } else if(this.periodOfWater['periodType'] == PeriodType.Year) {
        this.waterConsumptionBarChartOptions.xaxis.categories = this.monthsAbbr;

        this.waterConsumptionBarChartOptions.series = [];
        locationsArray.forEach(locationName => {
          let result = {name: locationName, data: []};
          this.waterConsumptionBarChartOptions.xaxis.categories.forEach(val => result['data'].push(0));
          
          let filteredByLocation = this.waterDetail['Consumptions'].filter(obj => obj['SupplyToLocationName'] == locationName);
          this.waterConsumptionBarChartOptions.xaxis.categories.forEach((val, idx) => {
            let filteredByDate = filteredByLocation.find(obj => obj['Month'] == (idx + 1));
            if(filteredByDate) result['data'][idx] = filteredByDate['Usage'];
          })
          this.waterConsumptionBarChartOptions.series.push(result);
        })
      } else if(this.periodOfWater['periodType'] == PeriodType.Day) {
        this.waterConsumptionBarChartOptions.xaxis.categories = [];
        let date = moment(this.periodOfElectricity['startDate']).toDate();
        this.waterConsumptionBarChartOptions.xaxis.categories.push(date.getDate() + '/' + (date.getMonth() + 1));

        this.waterConsumptionBarChartOptions.series = [];
        locationsArray.forEach(locationName => {
          let result = {name: locationName, data: []};
          this.waterConsumptionBarChartOptions.xaxis.categories.forEach(val => result['data'].push(0));
          
          let filteredByLocation = this.waterDetail['Consumptions'].find(obj => obj['SupplyToLocationName'] == locationName);
          if(filteredByLocation) result['data'] = [filteredByLocation['Usage']];

          this.waterConsumptionBarChartOptions.series.push(result);
        })
      }

      this._cdr.detectChanges();
    }
  }

  onShowElectricityDetail(event) {
    let data = {...event, buildingId: this.buildingId};
    this.periodOfElectricity = event;
    this._service.getElectirictyDetailForSmartBuilding(data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {        
      })
  }

  onShowWaterDetail(event) {
    let data = {...event, buildingId: this.buildingId};
    this.periodOfWater = event;
    this._service.getWaterDetailForSmartBuilding(data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {        
      })
  }

  /**
     * On destroy
     */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }
}
