import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
  
  @Input() buildingId: number;
  @Input() partnerId: number;
  
  form: UntypedFormGroup;
  buildings: IUmfaBuilding[] = [];
  treeBoxValue: any[];

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
  startPeriodId: number;
  endPeriodId: number;

  splitTypeItems: any[] = [{id: 0, name: 'Combined'}, {id: 1, name: 'Split 1'}, {id: 2, name: 'Split 2'}];
  groupByItems: any[] = [ {id: 1, name: 'Tenant'}, {id: 2, name: 'Shop'}];
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
      SplitIndicator: [0],
      Sort: ['Tenant'],
      Shops: [[], Validators.required],
    });

    if(this.partnerId) {
      this.form.get('PartnerId').setValue(this.partnerId);
      this.reportService.selectPartner(this.partnerId);
      
    }
    if(this.buildingId) {
      this.form.get('BuildingId').setValue(this.buildingId);
      this.reportService.loadPeriods(this.buildingId);
    }
    this.umfaService.shops$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        if(data && data.length > 0) {
          this.shopItems = [{ShopId: '0', ShopName: 'All', expanded: true}];
          let shopValue = ['0'];
          data.map(item => {
            item['categoryId'] = '0';
            this.shopItems.push(item);
            shopValue.push(item['ShopId']);
          });
          this.treeBoxValue = shopValue;
          this.form.get('Shops').setValue(this.treeBoxValue);
        }
      })
  }
  
  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.Name.toLocaleLowerCase().indexOf(term) > -1;
  }

  onTreeViewReady(event) {
    event.component.selectAll();
    this.form.get('Shops').setValue(event.component.getSelectedNodeKeys());
  }
  
  onInitialized(event) {
    event.component.selectAll();
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
      //this.reportService.loadPeriods(this.form.get('BuildingId').value);
      this.reportService.setConsumptionSummary(null);
    } else if(method == 'Building') {
      this.reportService.loadPeriods(this.form.get('BuildingId').value);
      this.form.get('PeriodId').setValue(null);
      this.reportService.setConsumptionSummary(null);
    } else if(method == 'Period'){
      if(this.form.get('BuildingId').value && this.form.get('PeriodId').value)
        this.umfaService.getUmfaShops(this.form.get('BuildingId').value, this.form.get('PeriodId').value).subscribe(() => {
          this.reportService.setConsumptionSummary(null);
          this.setCriteria();
          this._cdr.detectChanges();
        });
    } else {
      this.reportService.setConsumptionSummary(null);
    }
    //this.setCriteria();
  }

  setCriteria() {
    if (this.form.valid ) {
      if(this.reportService.SelectedReportId == 5) {
        this.reportService.ConsumptionSummaryReportParams = { 
          BuildingId: this.form.get('BuildingId').value, 
          PeriodId: this.form.get('PeriodId').value,
          SplitIndicator: this.form.get('SplitIndicator').value,
          Sort: this.form.get('Sort').value,
          Shops: this.form.get('Shops').value
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
