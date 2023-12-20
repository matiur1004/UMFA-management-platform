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
  ApexYAxis,
  ApexTooltip
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
  tooltip: ApexTooltip;
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
  hoursAbbr = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00','08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
                '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

  electricityLocations = [];
  waterLocations = [];
  
  electricityConsumptionColors = [];
  waterConsumptionColors = [];

  electricityConsumptionSeries: any = {series: []};
  waterConsumptionSeries: any = {series: []};

  periodOfElectricity: any;
  periodOfWater: any;

  electricityProfileDatasource: any;
  waterProfileDatasource: any;

  electricityPowerFactor:number;

  rangeEndValue: number;
  tickInterval: number;
  maxValue: number;
  averageValue: number;

  isElectricityLoading: boolean = false;
  isWaterLoading: boolean = false;

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
      tooltip: {
        custom: ({series, seriesIndex, dataPointIndex, w}) => {
          let headerTxt = '';
          if(this.periodOfElectricity['periodType'] == PeriodType.Month || this.periodOfElectricity['periodType'] == PeriodType.Week) {
            headerTxt = moment(this.periodOfElectricity['startDate']).add(dataPointIndex, 'days').format('ddd, MMM DD, YYYY');
          } else if(this.periodOfElectricity['periodType'] == PeriodType.Day) {
            headerTxt = this.hoursAbbr[dataPointIndex] + ', ' + moment(this.periodOfElectricity['startDate']).format('ddd, MMM DD, YYYY');
          } else {
            headerTxt = moment(this.periodOfElectricity['startDate']).add(dataPointIndex, 'months').format('MMM, YYYY');
          }
          let totalVal = 0;
          let html = '<div class="flex flex-col items-center" style="color: #212121">';
          html += '<div class="py-1.5 px-3 w-full mb-1" style="background-color: #EDEFF1;">' + 
                    '<span class="">' + headerTxt + '</span>' + 
                  '</div>'
          this.electricityLocations.forEach((location, idx) => {
            totalVal += series[idx][dataPointIndex];

            html += '<div class="flex font-mediumbold gap-x-2 text-md items-center w-full px-3">' +
                      '<div style="width: 9px; height: 9px; border-radius: 50%; background-color: '+this.electricityConsumptionColors[idx]+'"></div>' + 
                      '<span>' + location + ': '+series[idx][dataPointIndex].toFixed(2)+'</span>' +
                    '</div>'
          })
          html += '<div class="flex font-mediumbold gap-x-2 text-md items-center w-full mt-1 px-3 mb-2">' +
                      '<div style="width: 9px; height: 9px; border-radius: 50%; background-color: white;"></div>' + 
                      '<span>Total Energy: '+totalVal.toFixed(2)+'</span>' +
                    '</div>'
          html += '</div>';
          return html;
        }
      }
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
      tooltip: {
        custom: ({series, seriesIndex, dataPointIndex, w}) => {
          let headerTxt = '';
          if(this.periodOfWater['periodType'] == PeriodType.Month || this.periodOfWater['periodType'] == PeriodType.Week || this.periodOfWater['periodType'] == PeriodType.Day) {
            headerTxt = moment(this.periodOfWater['startDate']).add(dataPointIndex, 'days').format('ddd, MMM DD, YYYY');
          } else if(this.periodOfWater['periodType'] == PeriodType.Day) {
            headerTxt = this.hoursAbbr[dataPointIndex] + ', ' + moment(this.periodOfWater['startDate']).format('ddd, MMM DD, YYYY');
          } else {
            headerTxt = moment(this.periodOfWater['startDate']).add(dataPointIndex, 'months').format('MMM, YYYY');
          }
          let totalVal = 0;
          let html = '<div class="flex flex-col items-center" style="color: #212121">';
          html += '<div class="py-1.5 px-3 w-full mb-1" style="background-color: #EDEFF1;">' + 
                    '<span class="">' + headerTxt + '</span>' + 
                  '</div>'
          this.waterLocations.forEach((location, idx) => {
            totalVal += series[idx][dataPointIndex];

            html += '<div class="flex font-mediumbold gap-x-2 text-md items-center w-full px-3">' +
                      '<div style="width: 9px; height: 9px; border-radius: 50%; background-color: '+this.waterConsumptionColors[idx]+'"></div>' + 
                      '<span>' + location + ': '+series[idx][dataPointIndex].toFixed(2)+'</span>' +
                    '</div>'
          })
          html += '</div>';
          return html;
        }
      }
    };
  }

  ngOnInit(): void {
    this._service.smartBuildingElectricity$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          this.electricityDetail = res;
          this.setGraphForConsumption('electricity');
          this.setGraphForProfile('electricity');
          this.setGraphForPowerFactor();
          this._cdr.detectChanges();
        }
      })

    this._service.smartBuildingWater$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          this.waterDetail = res;
          this.setGraphForConsumption('water');
          this.setGraphForProfile('water');
          this.setGraphForAverageMaxFlow();
          this._cdr.detectChanges();
        }
      })
  }

  setGraphForPowerFactor() {
    let powerFactorData = this.electricityDetail['PowerFactorData'][0];
    this.electricityPowerFactor = powerFactorData['PowerFactor'];
  }

  setGraphForAverageMaxFlow() {
    this.maxValue = 0; this.averageValue = 0;
    this.waterDetail['Statistics'].forEach(obj => {
      if(obj['SupplyToLocationTypeId'] == 900) this.averageValue = obj['Usage'];
      if(obj['SupplyToLocationTypeId'] == 901) this.maxValue = obj['Usage'];
    });
    if(this.maxValue < 10) {
      this.rangeEndValue = Math.round(this.maxValue) + 1;  
      this.tickInterval = this.rangeEndValue / 5;
    } else {
      let percentVal = Math.round(this.maxValue / 90);
      this.rangeEndValue = percentVal * 100;
      this.tickInterval = this.rangeEndValue / 5;
    }
  }

  setGraphForProfile(type) {
    var pipe = new DatePipe('en_ZA');
    if(type == 'electricity') {
      let endIdx = 0;
      this.electricityDetail['ProfileData'].forEach((obj, idx) => {
        if(idx > 0 && obj['ReadingDate'] == this.electricityDetail['ProfileData'][0]['ReadingDate'] && endIdx == 0) endIdx = idx;
      })

      this.electricityProfileDatasource = this.electricityDetail['ProfileData'];
      this.electricityProfileDatasource = this.electricityProfileDatasource.map(obj => {
        return {...obj, ReadingDateString: pipe.transform(obj.ReadingDate, "yyyy-MM-dd HH:mm")};
      })
    } else {
      let endIdx = 0;
      this.waterDetail['ProfileData'].forEach((obj, idx) => {
        if(idx > 0 && obj['ReadingDate'] == this.waterDetail['ProfileData'][0]['ReadingDate'] && endIdx == 0) endIdx = idx;
      })
      //Usage
      this.waterProfileDatasource = this.waterDetail['ProfileData'];
      this.waterProfileDatasource = this.waterProfileDatasource.map(obj => {
        return {...obj, ReadingDateString: pipe.transform(obj.ReadingDate, "yyyy-MM-dd HH:mm")};
      })
    }
  }

  getProfileData(type, field, index) {
    if(type == 'electricity') {
      return this.electricityProfileDatasource[index][field];
    } else {
      return this.waterProfileDatasource[index][field];
    }
  }

  customizePowerFactorTooltip(arg: any) {
    return {text: `${arg.value.toFixed(3)}`}
  }

  customizeMaxAvgTooltip(arg: any) {
    return {text: `${arg.value.toFixed(3)}`}
  }

  setGraphForConsumption(type) {
    if(type == 'electricity') {
      this.electricityLocations = [];
      this.electricityDetail['Consumptions'].forEach(item => {
        if(this.electricityLocations.indexOf(item['SupplyToLocationName']) == -1) this.electricityLocations.push(item['SupplyToLocationName']);
      })
      this.electricityConsumptionColors = this._utils.utilityColorMapping()['Electricity'].slice(0, this.electricityLocations.length).reverse();
      this.electricityConsumptionBarChartOptions.xaxis.labels.rotate = 0;
      this.electricityConsumptionBarChartOptions.xaxis.labels.rotateAlways = false;

      if(this.periodOfElectricity['periodType'] == PeriodType.Month) {
        this.electricityConsumptionBarChartOptions.xaxis.categories = [];
        for (let i = moment(this.periodOfElectricity['startDate']).toDate().getDate(); i <= moment(this.periodOfElectricity['endDate']).subtract(1, 'day').toDate().getDate(); i++) {
          let day = moment(this.periodOfElectricity['startDate']).add(i - 1, 'days').toDate().getDay();
          this.electricityConsumptionBarChartOptions.xaxis.categories.push([i.toString(), this.weeksAbbr[day]]);
        }
        
        this.electricityConsumptionBarChartOptions.series = [];
        this.electricityLocations.forEach(locationName => {
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
        this.electricityLocations.forEach(locationName => {
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
        this.electricityLocations.forEach(locationName => {
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
        if(this.electricityLocations.length > 0) this.electricityConsumptionBarChartOptions.xaxis.categories = this.hoursAbbr;
        else this.electricityConsumptionBarChartOptions.xaxis.categories = [];

        this.electricityConsumptionBarChartOptions.xaxis.labels.rotate = -45;
        this.electricityConsumptionBarChartOptions.xaxis.labels.rotateAlways = true;

        this.electricityConsumptionBarChartOptions.series = [];
        this.electricityLocations.forEach(locationName => {
          let result = {name: locationName, data: []};
          this.electricityConsumptionBarChartOptions.xaxis.categories.forEach(val => result['data'].push(0));
          
          let filteredByLocation = this.electricityDetail['Consumptions'].filter(obj => obj['SupplyToLocationName'] == locationName);
          if(filteredByLocation) {
            this.electricityConsumptionBarChartOptions.xaxis.categories.forEach((val, idx) => {
              let filteredByDate = filteredByLocation.find(obj => obj['Hour'] == idx);
              if(filteredByDate) result['data'][idx] = filteredByDate['Energy'];
            })
          }
          

          this.electricityConsumptionBarChartOptions.series.push(result);
        })
      }
      this._cdr.detectChanges();
    } else {
      this.waterLocations = [];
      this.waterDetail['Consumptions'].forEach(item => {
        if(this.waterLocations.indexOf(item['SupplyToLocationName']) == -1) this.waterLocations.push(item['SupplyToLocationName']);
      })

      this.waterConsumptionColors = this._utils.utilityColorMapping()['Water'].slice(0, this.waterLocations.length).reverse();
      this.waterConsumptionBarChartOptions.xaxis.labels.rotate = 0;
      this.waterConsumptionBarChartOptions.xaxis.labels.rotateAlways = false;
      if(this.periodOfWater['periodType'] == PeriodType.Month) {
        this.waterConsumptionBarChartOptions.xaxis.categories = [];
        for (let i = moment(this.periodOfWater['startDate']).toDate().getDate(); i <= moment(this.periodOfWater['endDate']).subtract(1, 'day').toDate().getDate(); i++) {
          let day = moment(this.periodOfWater['startDate']).add(i - 1, 'days').toDate().getDay();
          this.waterConsumptionBarChartOptions.xaxis.categories.push([i.toString(), this.weeksAbbr[day]]);
        }

        this.waterConsumptionBarChartOptions.series = [];
        this.waterLocations.forEach(locationName => {
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
        this.waterLocations.forEach(locationName => {
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
        this.waterLocations.forEach(locationName => {
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
        if(this.waterLocations.length > 0) this.waterConsumptionBarChartOptions.xaxis.categories = this.hoursAbbr;
        else this.waterConsumptionBarChartOptions.xaxis.categories = [];

        this.waterConsumptionBarChartOptions.xaxis.labels.rotate = -45;
        this.waterConsumptionBarChartOptions.xaxis.labels.rotateAlways = true;

        this.waterConsumptionBarChartOptions.series = [];
        this.waterLocations.forEach(locationName => {
          let result = {name: locationName, data: []};
          this.waterConsumptionBarChartOptions.xaxis.categories.forEach(val => result['data'].push(0));
          
          let filteredByLocation = this.waterDetail['Consumptions'].filter(obj => obj['SupplyToLocationName'] == locationName);
          if(filteredByLocation) {
            this.waterConsumptionBarChartOptions.xaxis.categories.forEach((val, idx) => {
              let filteredByDate = filteredByLocation.find(obj => obj['Hour'] == idx);
              if(filteredByDate) result['data'][idx] = filteredByDate['Usage'];
            })
          }
          

          this.waterConsumptionBarChartOptions.series.push(result);
        })
      }

      this._cdr.detectChanges();
    }
  }

  onShowElectricityDetail(event) {
    let data = {...event, buildingId: this.buildingId};
    this.periodOfElectricity = event;
    this.isElectricityLoading = true;
    this._service.getElectirictyDetailForSmartBuilding(data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.isElectricityLoading = false;
        this._cdr.detectChanges();
      })
  }

  onShowWaterDetail(event) {
    let data = {...event, buildingId: this.buildingId};
    this.periodOfWater = event;
    this.isWaterLoading = true;
    this._service.getWaterDetailForSmartBuilding(data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.isWaterLoading = false;
        this._cdr.detectChanges();
      })
  }

  /**
     * On destroy
     */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._service.destroySmartBuilding();
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }
}
