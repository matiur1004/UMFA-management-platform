import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IUmfaBuilding } from '@core/models';
import { DXReportService } from '@shared/services';

@Component({
  selector: 'report-criteria-utility',
  templateUrl: './report-criteria-utility.component.html',
  styleUrls: ['./report-criteria-utility.component.scss']
})
export class ReportCriteriaUtilityComponent implements OnInit {

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

  recoveriesItems: any[] = [{id: 1, name: 'Client Recoveries'}, {id: 2, name: 'UMFA Recoveries'}];
  expenseItems: any[] = [{id: 0, name: 'Client Expense'}, {id: 1, name: 'UMFA Bulk Readings'}, {id: 2, name: 'Council Account'}];
  serviceTypeItems: any[] = [
    {id: 1, name: 'Electricity'},
    {id: 2, name: 'Water'},
    {id: 3, name: 'Sewerage'},
    {id: 4, name: 'Rates'},
    {id: 5, name: 'Refuse'},
    {id: 6, name: 'Gas'},
    {id: 7, name: 'Diesel'}
  ];
  visibleItems = ['Client Expense', 'Client Recovery', 'Council Account', 'UMFA Bulk Reading', 'UMFA Recovery', 'Potential Recovery', 'Non Recoverable', 'UMFA Reading Dates', 'Council Reading Dates'];
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

  getVisibleControl(index, name) {
    return this.form.get('visible')['controls'][name];
  }

  ngOnInit(): void {
    let visibleItemsControls = {};
    this.visibleItems.forEach(item => {
      visibleItemsControls[item] = [true];
    })
    this.form = this._formBuilder.group({
      partnerId: [null],
      buildingId: [null, Validators.required],
      startPeriodId: [null, Validators.required],
      endPeriodId: [null, Validators.required],
      Recoveries: [2, Validators.required],
      Expense: [1, Validators.required],
      serviceType: [null, Validators.required],
      visible: this._formBuilder.group(visibleItemsControls)
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
      this.form.get('buildingId').setValue(null);
      this.form.get('startPeriodId').setValue(0);
      this.form.get('endPeriodId').setValue(0);
      this.reportService.loadPeriods(this.form.get('buildingId').value);
      this.reportService.selectStartPeriod(this.form.get('startPeriodId').value);
      this.reportService.setShopUsageVariance([]);
      this.reportService.setShopCostVariance([]);
    } else if(method == 'Building') {
      this.reportService.loadPeriods(this.form.get('buildingId').value);
      this.form.get('startPeriodId').setValue(0);
      this.form.get('endPeriodId').setValue(0);
      this.reportService.selectStartPeriod(this.form.get('startPeriodId').value);
      this.reportService.setShopUsageVariance([]);
      this.reportService.setShopCostVariance([]);
    } else if (method == 'StartPeriod') {
      this.reportService.selectStartPeriod(this.form.get('startPeriodId').value);
    } else if (method == 'EndPeriod') {
      this.reportService.ShowResults(false);
    }
    this.setCriteria();
  }

  setCriteria() {
    if (this.form.valid ) {
      if(this.reportService.SelectedReportId == 4) {
        this.reportService.ShopUsageVarianceParams = { 
          BuildingId: this.form.get('buildingId').value, 
          FromPeriodId: this.form.get('startPeriodId').value, 
          ToPeriodId: this.form.get('endPeriodId').value,
          AllTenants: this.form.get('allTenants').value,
        }
      }
      
      this.reportService.setFrmValid(2, true);
    } else {
      this.reportService.ShopUsageVarianceParams = null;
      this.reportService.setFrmValid(2, false);
    }
  }

}
