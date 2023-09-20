import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DXReportService } from 'app/shared/services/dx-report-service';
import { Subject, Subscription, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-dx-report-viewer',
  templateUrl: './dx-report-viewer.component.html',
  styleUrls: ['./dx-report-viewer.component.scss']
})
export class DxReportViewerComponent implements OnInit, OnDestroy {

  @Input() buildingReportId: number;
  @Input() partnerId: number;
  @Input() buildingId: number;
  
  private errorMessageSubject = new Subject<string>();
  localErrMsg$ = this.errorMessageSubject.asObservable();

  remoteErrorSub: Subscription = this.reportService.Error$
    .pipe(
      tap(m => this.errorMessageSubject.next(m))
    )
    .subscribe();
  
  reportList$ = this.reportService.dxReportList$.pipe(tap(rl => { }));
  
  formValid: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  get frmsValid(): boolean {
    return this.reportService.IsFrmsValid();
  }

  get reportId(): number {
    return this.reportService.SelectedReportId;
  }

  get params(): any {
    return null;
  }


  constructor(private reportService: DXReportService, private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if(this.buildingReportId) this.reportService.SelectedReportId = this.buildingReportId;

    this.reportService.isFormValid$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((status: boolean) => {
        this.formValid = status;
        this._cdr.detectChanges();
      });
  }
  
  ngOnDestroy(): void {
    this.remoteErrorSub.unsubscribe();
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    this.reportService.destroyReportViewer();
  }

  showReport(e: any) {
    if(this.reportService.SelectedReportId == 1) {
      this.reportService.getReportForBuildingRecovery().subscribe();
      //this.reportService.ShowResults(true); // Building Recovery Report
    }
    if(this.reportService.SelectedReportId == 2) {
      this.reportService.getReportDataForShop().subscribe();
      //this.reportService.ShowShopResults(true); // Shop Usage Variance Report
    }
    if(this.reportService.SelectedReportId == 3) {
      this.reportService.getReportDataForShopCosts().subscribe();
    }
    if(this.reportService.SelectedReportId == 4) {
      this.reportService.getReportDataForUtility().subscribe();
    }
    if(this.reportService.SelectedReportId == 5) {
      this.reportService.getReportDataForConsumptionSummary().subscribe();
    }
    if(this.reportService.SelectedReportId == 6) {
      this.reportService.getReportDataForConsumptionSummaryRecon().subscribe();
    }
  }

}
