import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IUmfaBuilding } from 'app/core/models';
import { DXReportService } from 'app/shared/services/dx-report-service';
import { tap } from 'rxjs';

@Component({
  selector: 'report-criteria',
  templateUrl: './report-criteria.component.html',
  styleUrls: ['./report-criteria.component.scss']
})
export class ReportCriteriaComponent implements OnInit, OnDestroy {
  
  form: UntypedFormGroup;
  buildings: IUmfaBuilding[] = [];
  constructor(private reportService: DXReportService, private _formBuilder: UntypedFormBuilder) { }

  get reportId(): number {
    return this.reportService.SelectedReportId;
  }

  get showPage(): boolean {
    return this.reportService.ShowCrit();
  }

  partnerList$ = this.reportService.obsPartners;
  buildingList$ = this.reportService.obsBuildings;
  periodList$ = this.reportService.obsPeriods;
  endPeriodList$ = this.reportService.obsEndPeriods;
  buildingId: number;
  partnerId: number;
  startPeriodId: number;
  endPeriodId: number;

  custPartnerTemplate = (arg: any) => {
    var ret = "<div class='custom-item' title='" + arg.Name + "'>" + arg.Name + "</div>";
    return ret;
  }

  custBldTemplate = (arg: any) => {
    var ret = "<div class='custom-item' title='" + arg.Name + " (" + arg.Partner + ")'>" + arg.Name + "</div>";
    return ret;
  }

  custPeriodTemplate = (arg: any) => {
    const datepipe: DatePipe = new DatePipe('en-ZA');
    var ret = "<div class='custom-item' title='(" + datepipe.transform(arg.PeriodStart, 'yyyy/MM/dd') + " - " + datepipe.transform(arg.PeriodEnd, 'yyyy/MM/dd') + ")'>" + arg.PeriodName + "</div>";
    return ret;
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      partnerId: [null, Validators.required],
      buildingId: [null, Validators.required],
      startPeriodId: [null, Validators.required],
      endPeriodId: [null, Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.reportService.resetAll();
  }

  valueChanged(e: any, method: string) {
    if(method == 'Partner') {
      this.reportService.selectPartner(this.form.get('partnerId').value);
    } else if(method == 'Building') {
      this.reportService.loadPeriods(this.form.get('buildingId').value);
    } else if (method == 'StartPeriod') {
      this.reportService.selectStartPeriod(this.form.get('startPeriodId').value);
    } else if (method == 'EndPeriod') {
      this.reportService.ShowResults(false);
    }
    this.setCriteria();
    // if (e.value) {
    //   if (e.value != e.previousValue) {
    //     if (e.element.id == 'partner') {
    //       this.buildingId = null;
    //       this.startPeriodId = null;
    //       this.endPeriodId = null;
    //       this.reportService.selectPartner(e.value);
    //     }
    //     if (e.element.id == 'building') {
    //       this.reportService.loadPeriods(e.value);
    //       this.startPeriodId = null;
    //       this.endPeriodId = null;
    //     }
    //     if (e.element.id == 'startPeriod') {
    //       this.reportService.selectStartPeriod(e.value);
    //       this.endPeriodId = null;
    //     }
    //     if (e.element.id == 'endPeriod') {
    //       this.reportService.ShowResults(false);
    //     }
    //   }
    //   this.setCriteria(frm);
    // }
  }

  setCriteria() {
    if (this.form.valid ) {
      this.reportService.BuildingRecoveryParams = { 
        BuildingId: this.form.get('buildingId').value, 
        StartPeriodId: this.form.get('startPeriodId').value, 
        EndPeriodId: this.form.get('endPeriodId').value
      }
      this.reportService.setFrmValid(2, true);
    } else {
      this.reportService.BuildingRecoveryParams = null;
      this.reportService.setFrmValid(2, false);
    }
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.Name.toLocaleLowerCase().indexOf(term) > -1;
  }
}
