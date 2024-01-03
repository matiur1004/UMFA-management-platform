import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../dasboard.service';
import { AllowedPageSizes } from '@core/helpers';
import moment from 'moment';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';

export type ChartSparklineOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: any; //ApexMarkers;
  stroke: any; //ApexStroke;
  yaxis: ApexYAxis | ApexYAxis[];
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  colors: string[];
  labels: string[] | number[];
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-tenant-assigned-meters',
  templateUrl: './tenant-assigned-meters.component.html',
  styleUrls: ['./tenant-assigned-meters.component.scss']
})
export class TenantAssignedMetersComponent implements OnInit {

  @Input() tenantId;
  @Input() buildingId;

  dataSource: any;
  applyFilterTypes: any;
  currentFilter: any;
  form: UntypedFormGroup;
  activeItemList = ['Yes', 'No', 'All'];
  allItems: any[] = [];
  public commonLineSparklineOptions: Partial<ChartSparklineOptions> = {
    chart: {
      type: "line",
      width: 140,
      height: 30,
      sparkline: {
        enabled: true
      }
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function(seriesName) {
            return "";
          }
        }
      },
      marker: {
        show: false
      }
    },
    markers: {size: 4},
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 3,
      dashArray: 0,       
    }
  };

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  readonly allowedPageSizes = AllowedPageSizes;
  
  constructor(
    private dashboardService: DashboardService,
    private _formBuilder: UntypedFormBuilder,
  ) {
    this.applyFilterTypes = [{
        key: 'auto',
        name: 'Immediately',
    }, {
        key: 'onClick',
        name: 'On Button Click',
    }];
    this.currentFilter = this.applyFilterTypes[0].key;
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      active: ['All'],
    })

    this.dashboardService.tenantAssignedMetersDashboard$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          this.allItems = res.map(item => {
            let historyVal = item.UsageHistory ? item.UsageHistory.split(", ") : [];
            historyVal = historyVal.map(val => Number(val));
            return {...item, UsageHistory: [{data: historyVal}]};
          });
          this.dataSource = this.allItems;
        }
      });

      this.form.get('active').valueChanges.subscribe(res => {
        if(res == 'All') this.dataSource = this.allItems;
        else {
          let status = res == "Yes" ? true : false;
          let results = this.allItems.filter(obj => obj['IsActive'] == status);
          this.dataSource = results;
        }
      })
  }

  onCustomizeDateTime(cellInfo) {
    if(!cellInfo.value) return 'N/A';
    return moment(new Date(cellInfo.value)).format('DD/MM/YYYY');
  }
  
  onRowClick(event) {
    this.dashboardService.showTenantReadings({buildingId: this.buildingId, shopId: event.data['ShopID'], meterId: event.data['BuildingServiceID']});
  }

  /**
     * On destroy
     */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
      this.dashboardService.destroyTenantAssignedMeters();
  }
}
