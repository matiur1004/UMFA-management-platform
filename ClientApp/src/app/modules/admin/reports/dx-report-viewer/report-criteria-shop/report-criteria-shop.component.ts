import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IUmfaBuilding } from '@core/models';
import { DXReportService } from '@shared/services';

@Component({
  selector: 'report-criteria-shop',
  templateUrl: './report-criteria-shop.component.html',
  styleUrls: ['./report-criteria-shop.component.scss']
})
export class ReportCriteriaShopComponent implements OnInit {

  form: UntypedFormGroup;
  buildings: IUmfaBuilding[] = [];
  constructor(private reportService: DXReportService, private _formBuilder: UntypedFormBuilder) { }


  get showPage(): boolean {
    return this.reportService.ShowCrit();
  }

  partnerList$ = this.reportService.obsPartners;
  buildingList$ = this.reportService.obsBuildings;
  periodList$ = this.reportService.obsPeriods;
  endPeriodList$ = this.reportService.obsEndPeriods;
  tenantOptions$ = this.reportService.tenantOptions$;
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
      partnerId: [null],
      buildingId: [null, Validators.required],
      startPeriodId: [null, Validators.required],
      endPeriodId: [null, Validators.required],
      allTenants: [1, Validators.required]
    });
  }
  
  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.Name.toLocaleLowerCase().indexOf(term) > -1;
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
  }

  setCriteria() {
    if (this.form.valid ) {
      this.reportService.ShopUsageVarianceParams = { 
        BuildingId: this.form.get('buildingId').value, 
        StartPeriodId: this.form.get('startPeriodId').value, 
        ToPeriodId: this.form.get('endPeriodId').value,
        AllTenants: this.form.get('allTenants').value,
      }
      this.reportService.setFrmValid(2, true);
    } else {
      this.reportService.ShopUsageVarianceParams = null;
      this.reportService.setFrmValid(2, false);
    }
  }

}
