import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IUmfaBuilding } from '@core/models';
import { DXReportService } from '@shared/services';
import { Subject } from 'rxjs';

@Component({
  selector: 'report-criteria-consumption-recon',
  templateUrl: './report-criteria-consumption-recon.component.html',
  styleUrls: ['./report-criteria-consumption-recon.component.scss']
})
export class ReportCriteriaConsumptionReconComponent implements OnInit {

  form: UntypedFormGroup;
  buildings: IUmfaBuilding[] = [];
  
  partnerList$ = this.reportService.obsPartners;
  buildingList$ = this.reportService.obsBuildings;
  periodList$ = this.reportService.obsPeriods;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private reportService: DXReportService, 
  ) { }

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
      PartnerId: [null],
      BuildingId: [null, Validators.required],
      PeriodId: [null, Validators.required],
    })
  }

  valueChanged(e: any, method: string) {
    if(method == 'Partner') {
      this.reportService.selectPartner(this.form.get('PartnerId').value);
      this.form.get('BuildingId').setValue(null);
      this.form.get('PeriodId').setValue(0);
    } else if(method == 'Building') {
      this.reportService.loadPeriods(this.form.get('BuildingId').value);
      this.form.get('PeriodId').setValue(null);
    }
    this.reportService.setConsumptionSummaryRecon(null);
    this.setCriteria();
  }

  setCriteria() {
    if (this.form.valid ) {
      if(this.reportService.SelectedReportId == 6) {
        this.reportService.ConsumptionSummaryReconReportParams = {
          PartnerId: this.form.get('PartnerId').value,
          BuildingId: this.form.get('BuildingId').value,
          PeriodId: this.form.get('PeriodId').value,
        }
      }
      this.reportService.setFrmValid(2, true);
    } else {
      this.reportService.ShopUsageVarianceParams = null;
      this.reportService.setFrmValid(2, false);
    }
  }

  ngOnDestroy(): void {
    this.reportService.resetAll();
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
