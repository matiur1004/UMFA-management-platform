import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IUmfaBuilding } from '@core/models';
import { DXReportService } from '@shared/services';
import { UmfaService } from '@shared/services/umfa.service';
import { DxTreeViewComponent } from 'devextreme-angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'report-criteria-consumption',
  templateUrl: './report-criteria-consumption.component.html',
  styleUrls: ['./report-criteria-consumption.component.scss']
})
export class ReportCriteriaConsumptionComponent implements OnInit {

  @ViewChild(DxTreeViewComponent, { static: false }) treeView;
  
  form: UntypedFormGroup;
  buildings: IUmfaBuilding[] = [];
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private reportService: DXReportService, 
    private _formBuilder: UntypedFormBuilder, 
    private umfaService: UmfaService,
    private _cdr: ChangeDetectorRef) { }


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

  splitTypeItems: any[] = [{id: 0, name: 'Combined'}, {id: 1, name: 'Split 1'}, {id: 2, name: 'Split 2'}];
  groupByItems: any[] = [{id:0, name: 'Account'}, {id: 1, name: 'Tenant'}, {id: 2, name: 'Shop'}];
  shopItems: any[] = [];

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
      SplitIndicator: [2, Validators.required],
      Sort: [1, Validators.required],
      Shops: [[62345], Validators.required],
    });

    this.umfaService.shops$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        if(data) {
          this.shopItems = [{ShopId: '0', ShopName: 'All', expanded: true}]
          data.map(item => {
            this.shopItems.push({...item, categoryId: '0'});
          });
          this._cdr.detectChanges();
        }
      })
  }
  
  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.Name.toLocaleLowerCase().indexOf(term) > -1;
  }

  onTreeViewReady(event) {

  }
  
  onTreeViewSelectionChanged(event) {
    if(event.itemData.ShopId == '0') {
      if(event.itemData.selected == true) {
        this.shopItems.forEach(item => {
          if(item['ShopId'] != '0') {
            event.component.selectItem(item['ShopId']);
          }
        })
      } else {
        event.component.unselectAll();
      }
    }
    this.form.get('Shops').setValue(event.component.getSelectedNodeKeys());
  }
  
  ngOnDestroy(): void {
    this.reportService.resetAll();
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  valueChanged(e: any, method: string) {
    if(method == 'Partner') {
      this.reportService.selectPartner(this.form.get('PartnerId').value);
      this.form.get('BuildingId').setValue(null);
      this.form.get('PeriodId').setValue(0);
      this.reportService.loadPeriods(this.form.get('BuildingId').value);
      this.reportService.setConsumptionSummary(null);
    } else if(method == 'Building') {
      this.reportService.loadPeriods(this.form.get('BuildingId').value);
      this.form.get('PeriodId').setValue(0);
      this.reportService.setConsumptionSummary(null);
    } else if(method == 'Period'){
      if(this.form.get('BuildingId').value && this.form.get('PeriodId').value)
        this.umfaService.getUmfaShops(this.form.get('BuildingId').value, this.form.get('PeriodId').value).subscribe();
    } else {
      this.reportService.setConsumptionSummary(null);
    }
    this.setCriteria();
  }

  setCriteria() {
    if (this.form.valid ) {
      if(this.reportService.SelectedReportId == 5) {
        console.log(this.form.get('Shops').value);
        this.reportService.ConsumptionSummaryReportParams = { 
          BuildingId: 2403, //this.form.get('BuildingId').value, 
          PeriodId: 174270, //this.form.get('PeriodId').value,
          SplitIndicator: 0, //this.form.get('SplitIndicator').value,
          Sort: 'Tenant', //this.form.get('Sort').value,
          Shops: [62345]
        }
      }
      this.reportService.setFrmValid(2, true);
    } else {
      this.reportService.ShopUsageVarianceParams = null;
      this.reportService.setFrmValid(2, false);
    }
  }

}
