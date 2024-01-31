import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IAmrChartDemProfParams } from 'app/core/models';
import { AmrDataService } from 'app/shared/services/amr.data.service';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-amr-charts',
  templateUrl: './amr-charts.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './amr-charts.component.scss',
    "../../../../../../node_modules/devextreme/dist/css/dx.light.css"
  ]
})
export class AmrChartsComponent implements OnInit, OnDestroy {

  
  private errorMessageSubject = new Subject<string>();
  localErrMsg$ = this.errorMessageSubject.asObservable();

  headerInfo: any;
  dataType: string;

  supError: Subscription;
  totalGridDataSource = [];
  enabledDownload: boolean = false;

  get frmsValid(): boolean {
    return this.amrService.IsFrmsValid();
  }

  get selectedId(): number {
    if (this.amrService != null && this.amrService != undefined && this.amrService.SelectedChart != null) {
      return this.amrService.SelectedChart.Id ?? 0;
    }
    else
      return 0;
  }

  get params(): IAmrChartDemProfParams {
    return this.amrService.DemChartParams;
  }

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private amrService: AmrDataService, private _cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.supError = this.amrService.obsFrmError$.subscribe(
      (e) => this.errorMessageSubject.next(e)
    );
    
    this.amrService.result$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {
        this.enabledDownload = false;
        if(res) {
          this.enabledDownload = true;
        }
      })
  }

  ngOnDestroy(): void {
    this.supError.unsubscribe();
    this.amrService.destroyAll();
  }

  showChart(e: any) {
    this.amrService.displayChart(true);
  }

  onExport() {
    this.amrService.downloadData();
  }
}
