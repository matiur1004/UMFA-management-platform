import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DXReportService, UserService } from '@shared/services';
import { IAmrChart } from 'app/core/models';
import { AmrDataService } from 'app/shared/services/amr.data.service';
import { map, tap } from 'rxjs';

@Component({
  selector: 'amr-graphselection',
  templateUrl: './amr-graph-selection.component.html',
  styleUrls: ['./amr-graph-selection.component.scss']
})
export class AmrGraphSelectionComponent implements OnInit, OnDestroy {

  amrCharts = {} as IAmrChart[];
  selectedChartId: number;

  chartList$ = this.amrService.amrChartList$
    .pipe(
      tap(c => {
        //console.log("Chart List retrieved");
      }),
      map(ch => {
        this.amrCharts = ch;
        return ch;
      })
    );
  
  form: UntypedFormGroup;

  custChrtTemplate = (arg: any) => {
    var ret = "<div class='custom-item' title='" + arg.Description + "'>" + arg.Name + "</div>";
    return ret;
  }

  constructor(
    private amrService: AmrDataService,
    private _formBuilder: UntypedFormBuilder,
    private reportService: DXReportService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      selectedChartId: [null, Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.amrService.SelectedChart = null;
    this.amrService.setFrmValid(1, false);
  }

  selectChart() {
    //this.errorMessageSubject.next(null)
    if(this.form.valid) {
      this.amrService.setFrmValid(1, true);
      this.amrService.SelectedChart = this.amrCharts.find(p => p.Id == this.form.get('selectedChartId').value);
    }  else {
      this.amrService.setFrmValid(1, false);
    }
    
  }

  selectionChanged(e: any) {
    this.amrService.displayChart(false);
    this.amrService.setFrmValid(1, false);
    this.amrService.setFrmValid(2, false);
    this.amrService.SelectedChart = null;
    this.selectChart();
  //   if (e.value) {
  //     if (e.previousValue && e.value != e.previousValue) {
  //       this.amrService.displayChart(false);
  //       this.amrService.setFrmValid(1, false);
  //       this.amrService.setFrmValid(2, false);
  //       this.amrService.SelectedChart = null;
  //     }
  //     this.selectChart(frm);
  //   }

  }

  ngAfterViewInit() {
    this.reportService.loadPartners(this.userService.userValue.UmfaId);
    this.reportService.loadBuildings(this.userService.userValue.UmfaId);
  }
}
