import { Component, Input, OnInit } from '@angular/core';
import { DXReportService } from '@shared/services/dx-report-service';
@Component({
  selector: 'app-building-reports',
  templateUrl: './building-reports.component.html',
  styleUrls: ['./building-reports.component.scss']
})
export class BuildingReportsComponent implements OnInit {

  @Input() reportType: string;
  @Input() buildingId: number;
  @Input() partnerId: number;

  reportId;
  constructor(
    private reportService: DXReportService
  ) { }

  ngOnInit(): void {
    if(this.reportType) {
      if(this.reportType == 'Building Feedback') {

      } else {
        this.reportService.dxReportList$.subscribe(reportList => {
          let selectedReport = reportList.find(obj => obj.Name == this.reportType);
          this.reportId = selectedReport.Id;
        })
      }
      
    }
  }

}
