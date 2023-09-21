import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AllowedPageSizes } from '@core/helpers';
import { DXReportService } from '@shared/services';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit {

  readonly allowedPageSizes = AllowedPageSizes;
  
  @Input() buildingId: number;
  @Input() partnerId: number;
  
  form: UntypedFormGroup;
  partnerList$ = this.reportService.obsPartners;
  buildingList$ = this.reportService.obsBuildings;
  
  applyFilterTypes: any;
  currentFilter: any;
  dataSource: any;
  initiatedList = false;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private reportService: DXReportService,
    private dashboardService: DashboardService,
    private _cdr: ChangeDetectorRef,
  ) { 
    this.applyFilterTypes = [{
        key: 'auto',
        name: 'Immediately',
    }, {
        key: 'onClick',
        name: 'On Button Click',
    }];
    this.currentFilter = this.applyFilterTypes[0].key;
  }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      PartnerId: [null],
      BuildingId: [null, Validators.required],
    })
    this.partnerList$.subscribe(res => {
      if(this.partnerId && res && res.length > 0) {
        this.form.get('PartnerId').setValue(this.partnerId);
        this.reportService.selectPartner(this.partnerId);
      }
    })
    
    this.dashboardService.shops$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {          
          this.dataSource = res.map(item => {
            return {...item, 'Occupied': item['Occupied'] ? 'Occupied' : 'Unoccupied'};
          });
          this._cdr.markForCheck();
        } else {
          this.dataSource = [];
        }
        if(this.dataSource.length > 0) this.initiatedList = true;
        if(!this.buildingId) {
          if(this.dashboardService.selectedShopInfo) {
            this.form.get('PartnerId').setValue(this.dashboardService.selectedShopInfo.partnerId);
            this.form.get('BuildingId').setValue(this.dashboardService.selectedShopInfo.buildingId);
          }
        }
        
      })

      if(this.buildingId) {
        this.form.get('BuildingId').setValue(this.buildingId);
        if(!this.dashboardService.selectedShopInfo) {
          this.dashboardService.getShopsByBuildingId(this.form.get('BuildingId').value).subscribe();
          this.dashboardService.selectedShopInfo = {'buildingId': this.buildingId, 'partnerId': this.partnerId};
        }
      }
      
  }

  custPartnerTemplate = (arg: any) => {
    var ret = "<div class='custom-item' title='" + arg.Name + "'>" + arg.Name + "</div>";
    return ret;
  }

  custBldTemplate = (arg: any) => {
    var ret = "<div class='custom-item' title='" + arg.Name + " (" + arg.Partner + ")'>" + arg.Name + "</div>";
    return ret;
  }

  valueChanged(e: any, method: string) {
    if(method == 'Partner') {
      this.reportService.selectPartner(this.form.get('PartnerId').value);
    } else if(method == 'Building') {
      this.dashboardService.selectedShopInfo = {'buildingId': this.form.get('BuildingId').value, 'partnerId': this.form.get('PartnerId').value};
      this.dashboardService.getShopsByBuildingId(this.form.get('BuildingId').value).subscribe();
    }
  }

  onRowClick(event) {
    if(event.data) {
      if(event.data.ShopID && event.data.ShopName)
        this.dashboardService.showShopDetailDashboard({shopId: event.data.ShopID, buildingId: this.form.get('BuildingId').value, shopName: event.data.ShopName});
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    //this.dashboardService.destroyShopList();
  }
}
