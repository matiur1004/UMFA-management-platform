import { Component, OnDestroy, OnInit } from '@angular/core';
import { DXReportService } from 'app/shared/services/dx-report-service';
import { Subject, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-dx-report-viewer',
  templateUrl: './dx-report-viewer.component.html',
  styleUrls: ['./dx-report-viewer.component.scss']
})
export class DxReportViewerComponent implements OnInit, OnDestroy {

  private errorMessageSubject = new Subject<string>();
  localErrMsg$ = this.errorMessageSubject.asObservable();

  remoteErrorSub: Subscription = this.reportService.Error$
    .pipe(
      tap(m => this.errorMessageSubject.next(m))
    )
    .subscribe();
  
  reportList$ = this.reportService.dxReportList$.pipe(tap(rl => { }));
  
  get frmsValid(): boolean {
    return this.reportService.IsFrmsValid();
  }

  get reportId(): number {
    return this.reportService.SelectedReportId;
  }

  get params(): any {
    return null;
  }

  constructor(private reportService: DXReportService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.remoteErrorSub.unsubscribe();
  }

  showReport(e: any) {
    if(this.reportService.SelectedReportId == 1) this.reportService.ShowResults(true); // Building Recovery Report
    if(this.reportService.SelectedReportId == 2) {
      // this.reportService.getReportDataForShop().subscribe(res => {
      //   console.log(res);
      // })
      this.reportService.ShowShopResults(true); // Shop Usage Variance Report
    }
  }

}
