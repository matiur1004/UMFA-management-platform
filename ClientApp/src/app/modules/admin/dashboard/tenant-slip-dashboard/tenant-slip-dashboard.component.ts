import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';

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
};

@Component({
  selector: 'app-tenant-slip-dashboard',
  templateUrl: './tenant-slip-dashboard.component.html',
  styleUrls: ['./tenant-slip-dashboard.component.scss']
})
export class TenantSlipDashboardComponent implements OnInit {

  @Input() criteria: any;
  
  tenantSlipData: any;
  headerDetail: any;
  detailDataSource: any;
  meterReadingDataSource: any;
  graphDataSource: any;

  public chartOptions: Partial<ChartOptions>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _service: DashboardService,
    private _cdr: ChangeDetectorRef
  ) { 
    this.chartOptions = {
      series: [
      ],
      chart: { 
        type: 'bar',
        height: 300
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '70%',
          endingShape: 'rounded',
          dataLabels: {
            position: "top" // top, center, bottom
          }
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return (Number(val) / 1000).toFixed(1) + "k";
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"]
        }
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['white']
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: 'Amount'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + ''
          }
        }
      }
    }
  }

  ngOnInit(): void {
    let data = {
      periodId: this.criteria.periodId,
      tenantId: this.criteria.tenantId,
      ShopIDs: this.criteria.reportType == 1 ? [this.criteria.shopId] : [0],
      SplitIndicator: -1
    };
    this._service.getTenantSlipData(data).subscribe();

    this._service.tenantSlipData$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          this.tenantSlipData = res;
          this.headerDetail = this.tenantSlipData['Header'];
          this.detailDataSource = this.tenantSlipData['Details'];
          this.meterReadingDataSource = this.tenantSlipData['MeterReadings'];
          this.graphDataSource = this.tenantSlipData['GraphData'];
          let seriesData = [{name: 'Abc', data: []}];
          this.chartOptions.xaxis.categories = this.graphDataSource.map(item => {
            seriesData[0].data.push(item['Levy']);
            return item['ReadingShort'];
          });
          this.chartOptions.series = seriesData;
          this._cdr.detectChanges();
        }
      })
  }

  onExport(type) {
    if(type == 'csv') this.onExportCSV();
    else this.onExportPdf();
  }

  onExportPdf() {
    const pdfDoc = new jsPDF('landscape', 'px', [780, 768]);
    const data = document.getElementById('tenant-slip-detail-report');

    html2canvas(data).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');

      pdfDoc.addImage(contentDataURL, 'PNG', 34, 20, 700, 700);
      pdfDoc.save('TenantSlipDetail.pdf');
    });
  }

  onExportCSV() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('report', {views: [{showGridLines: false}]});

    worksheet.mergeCells('A1:N50');

    const data = document.getElementById('tenant-slip-detail-report');

    html2canvas(data).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');

      const image = workbook.addImage({
        base64: contentDataURL,
        extension: "png",
      });
      worksheet.addImage(image, {
        tl: { col: 0, row: 1 },
        ext: { width: 800, height: 800 },
      });

      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Tenant Slip Detail.xlsx');
      });
    });
  }
}
