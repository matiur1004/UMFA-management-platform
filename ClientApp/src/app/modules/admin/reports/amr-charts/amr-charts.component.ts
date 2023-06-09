import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { IAmrChartDemProfParams } from 'app/core/models';
import { AmrDataService } from 'app/shared/services/amr.data.service';
import { Subject, Subscription } from 'rxjs';

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

  supError: Subscription;

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

  constructor(private amrService: AmrDataService) { }
  ngOnInit(): void {
    this.supError = this.amrService.obsFrmError$.subscribe(
      (e) => this.errorMessageSubject.next(e)
    );
  }

  ngOnDestroy(): void {
    this.supError.unsubscribe();
    this.amrService.destroyAll();
  }

  showChart(e: any) {
    console.log('showChart');
    this.amrService.displayChart(true);
  }
}
