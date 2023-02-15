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
  
  reportList$ = this.reportService.dxReportList$.pipe(tap(rl => { console.log('Report list: ' + JSON.stringify(rl)) }));
  
  get frmsValid(): boolean {
    return this.reportService.IsFrmsValid();
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
    this.reportService.ShowResults(true);
  }

}
