import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, Input } from '@angular/core';
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
  
  @Input() buildingId: number;
  @Input() partnerId: number;

  form: UntypedFormGroup;
  buildings: IUmfaBuilding[] = [];
  utilityListItems = ['Electricity', 'Water', 'Sewerage', 'Diesel'];

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
  // buildingId: number;
  // partnerId: number;
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
      endPeriodId: [null, Validators.required],
      utility: ['Electricity', Validators.required]
    });
    if(this.partnerId) {
      this.form.get('partnerId').setValue(this.partnerId);
      this.reportService.selectPartner(this.partnerId);      
    }
    if(this.buildingId) {
      this.form.get('buildingId').setValue(this.buildingId);
      this.reportService.loadPeriods(this.form.get('buildingId').value);
    }
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
    this.reportService.setBuildingRecovery(null);
    this.setCriteria();
  }

  setCriteria() {
    if (this.form.valid ) {
      this.reportService.BuildingRecoveryParams = { 
        BuildingId: this.form.get('buildingId').value, 
        StartPeriodId: this.form.get('startPeriodId').value, 
        EndPeriodId: this.form.get('endPeriodId').value,
        Utility: this.form.get('utility').value
      }
      this.reportService.setFrmValid(2, true);
      this.reportService.showFormValid(true);
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
