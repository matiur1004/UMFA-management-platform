import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IUmfaBuilding } from '@core/models';
import { DXReportService } from '@shared/services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'report-criteria-utility',
  templateUrl: './report-criteria-utility.component.html',
  styleUrls: ['./report-criteria-utility.component.scss']
})
export class ReportCriteriaUtilityComponent implements OnInit {

  @Input() buildingId: number;
  @Input() partnerId: number;
  
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
  visibleItems = [
    {name: 'Client Expense', key: 'ClientExpenseVisible'}, 
    {name: 'Client Recovery', key: 'ClientRecoverableVisible'}, 
    {name: 'Council Account', key: 'CouncilAccountVisible'}, 
    {name: 'UMFA Bulk Reading', key: 'BulkReadingVisible'}, 
    {name: 'UMFA Recovery', key: 'UmfaRecoveryVisible'}, 
    {name: 'Potential Recovery', key: 'PotentialRecVisible'}, 
    {name: 'Non Recoverable', key: 'NonRecVisible'}, 
    {name: 'UMFA Reading Dates', key: 'UmfaReadingDatesVisible'}, 
    {name: 'Council Reading Dates', key: 'CouncilReadingDatesVisible'}
  ];
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

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    let visibleItemsControls = {};
    this.visibleItems.forEach(item => {
      visibleItemsControls[item.key] = [true];
    })
    this.form = this._formBuilder.group({
      partnerId: [null],
      buildingId: [null, Validators.required],
      startPeriodId: [null, Validators.required],
      endPeriodId: [null, Validators.required],
      Recoveries: [2, Validators.required],
      Expenses: [1, Validators.required],
      ServiceType: [null, Validators.required],
      visible: this._formBuilder.group(visibleItemsControls)
    });

    if(this.partnerId) {
      this.form.get('partnerId').setValue(this.partnerId);
      this.reportService.obsBuildings
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((buildingList: any) => {
          if(buildingList && buildingList.length > 0) {
            this.reportService.selectPartner(this.partnerId);
          }
        });
      
    }
    if(this.buildingId) {
      this.form.get('buildingId').setValue(this.buildingId);
      this.reportService.loadPeriods(this.buildingId);
    }
  }
  
  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.Name.toLocaleLowerCase().indexOf(term) > -1;
  }

  valueChanged(e: any, method: string) {
    if(method == 'Partner') {
      this.reportService.selectPartner(this.form.get('partnerId').value);
      this.form.get('buildingId').setValue(null);
      this.form.get('startPeriodId').setValue(0);
      this.form.get('endPeriodId').setValue(0);
      this.reportService.loadPeriods(this.form.get('buildingId').value);
      this.reportService.selectStartPeriod(this.form.get('startPeriodId').value);
      this.reportService.setUtility(null);
    } else if(method == 'Building') {
      this.reportService.loadPeriods(this.form.get('buildingId').value);
      this.form.get('startPeriodId').setValue(0);
      this.form.get('endPeriodId').setValue(0);
      this.reportService.selectStartPeriod(this.form.get('startPeriodId').value);
      this.reportService.setUtility(null);
    } else if (method == 'StartPeriod') {
      this.reportService.selectStartPeriod(this.form.get('startPeriodId').value);
      this.reportService.setUtility(null);
    } else if (method == 'EndPeriod') {
      this.reportService.ShowResults(false);
      this.reportService.setUtility(null);
    } else {
      this.reportService.setUtility(null);
    }
    this.setCriteria();
  }

  setCriteria() {
    if (this.form.valid ) {
      if(this.reportService.SelectedReportId == 4) {
        let visibleVal = this.form.get('visible').value;
        this.reportService.UtilityReportParams = { 
          BuildingId: this.form.get('buildingId').value, 
          FromPeriodId: this.form.get('startPeriodId').value, 
          ToPeriodId: this.form.get('endPeriodId').value,
          Recoveries: this.form.get('Recoveries').value,
          Expenses: this.form.get('Expenses').value,
          ServiceType: this.form.get('ServiceType').value,
          ReconType: 1,
          NoteType: 1,
          ViewClientExpense: 1,
          ClientExpenseVisible: visibleVal['ClientExpenseVisible'],
          CouncilAccountVisible: visibleVal['CouncilAccountVisible'],
          BulkReadingVisible: visibleVal['BulkReadingVisible'],
          PotentialRecVisible: visibleVal['PotentialRecVisible'],
          NonRecVisible: visibleVal['NonRecVisible'],
          UmfaReadingDatesVisible: visibleVal['UmfaReadingDatesVisible'],
          CouncilReadingDatesVisible: visibleVal['CouncilReadingDatesVisible'],
          UmfaRecoveryVisible: visibleVal['UmfaRecoveryVisible'],
          ClientRecoverableVisible: visibleVal['ClientRecoverableVisible'],
        }
      }      
      this.reportService.setFrmValid(2, true);
      this.reportService.showFormValid(true);
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
