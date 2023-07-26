import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IUmfaBuilding } from '@core/models';
import { DXReportService } from '@shared/services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'report-criteria-shop',
  templateUrl: './report-criteria-shop.component.html',
  styleUrls: ['./report-criteria-shop.component.scss']
})
export class ReportCriteriaShopComponent implements OnInit {

  @Input() buildingId: number;
  @Input() partnerId: number;
  
  form: UntypedFormGroup;
  buildings: IUmfaBuilding[] = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
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

    this.reportService.reportChanged$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: boolean) => {
        if(res) {
          this.form.patchValue({
            partnerId: null,
            buildingId: null,
            startPeriodId: null,
            endPeriodId: null,
            allTenants: 1
          })
        }
      });
  }
  
  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.Name.toLocaleLowerCase().indexOf(term) > -1;
  }

  ngOnDestroy(): void {
    this.reportService.resetAll();
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  valueChanged(e: any, method: string) {
    if(method == 'Partner') {
      this.reportService.selectPartner(this.form.get('partnerId').value);
      this.form.get('buildingId').setValue(null);
      this.form.get('startPeriodId').setValue(0);
      this.form.get('endPeriodId').setValue(0);
      this.reportService.loadPeriods(this.form.get('buildingId').value);
      this.reportService.selectStartPeriod(this.form.get('startPeriodId').value);
      this.reportService.setShopUsageVariance(null);
      this.reportService.setShopCostVariance(null);
    } else if(method == 'Building') {
      this.reportService.loadPeriods(this.form.get('buildingId').value);
      this.form.get('startPeriodId').setValue(null);
      this.form.get('endPeriodId').setValue(null);
      this.reportService.selectStartPeriod(this.form.get('startPeriodId').value);
      this.reportService.setShopUsageVariance(null);
      this.reportService.setShopCostVariance(null);
    } else if (method == 'StartPeriod') {
      this.reportService.selectStartPeriod(this.form.get('startPeriodId').value);
      this.reportService.setShopUsageVariance(null);
      this.reportService.setShopCostVariance(null);
    } else if (method == 'EndPeriod') {
      this.reportService.ShowResults(false);
      this.reportService.setShopUsageVariance(null);
      this.reportService.setShopCostVariance(null);
    }
    this.setCriteria();
  }

  setCriteria() {
    if (this.form.valid ) {
      if(this.reportService.SelectedReportId == 2) {
        this.reportService.ShopUsageVarianceParams = { 
          BuildingId: this.form.get('buildingId').value, 
          FromPeriodId: this.form.get('startPeriodId').value, 
          ToPeriodId: this.form.get('endPeriodId').value,
          AllTenants: this.form.get('allTenants').value,
        }
      } else {
        this.reportService.ShopCostVarianceParams = { 
          BuildingId: this.form.get('buildingId').value, 
          FromPeriodId: this.form.get('startPeriodId').value, 
          ToPeriodId: this.form.get('endPeriodId').value,
          AllTenants: this.form.get('allTenants').value,
        }
      }
      
      this.reportService.setFrmValid(2, true);
      this.reportService.showFormValid(true);
    } else {
      this.reportService.ShopUsageVarianceParams = null;
      this.reportService.setFrmValid(2, false);
    }
  }
}
