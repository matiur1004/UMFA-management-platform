import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DXReportService } from '@shared/services';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';
import { AllowedPageSizes } from '@core/helpers';

@Component({
  selector: 'app-tenants-list',
  templateUrl: './tenants-list.component.html',
  styleUrls: ['./tenants-list.component.scss']
})
export class TenantsListComponent implements OnInit {

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
    
    this.dashboardService.tenants$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {          
          this.dataSource = res.map(item => {
            return {...item, 'Recoverable': item['Recoverable'] ? 'Recoverable' : 'Non Recoverable'};
          });
          this._cdr.markForCheck();
        } else {
          this.dataSource = [];
        }
        if(this.dataSource.length > 0) this.initiatedList = true;
        if(!this.buildingId) {
          if(this.dashboardService.selectedTenantInfo) {
            this.form.get('PartnerId').setValue(this.dashboardService.selectedTenantInfo.partnerId);
            this.form.get('BuildingId').setValue(this.dashboardService.selectedTenantInfo.buildingId);
          }
        }
        
      })

      if(this.buildingId) {
        this.form.get('BuildingId').setValue(this.buildingId);
        if(!this.dashboardService.selectedTenantInfo) {
          this.dashboardService.getTenants(this.form.get('BuildingId').value).subscribe();
          this.dashboardService.selectedTenantInfo = {'buildingId': this.buildingId, 'partnerId': this.partnerId};
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
      this.dashboardService.selectedTenantInfo = {'buildingId': this.form.get('BuildingId').value, 'partnerId': this.form.get('PartnerId').value};
      this.dashboardService.getTenants(this.form.get('BuildingId').value).subscribe();
    }
  }

  onRowClick(event) {
    if(event.data) {
      console.log(event.data);
      console.log(this.form.value);
      this.dashboardService.showTenantDetailDashboard({buildingId: this.form.get('BuildingId').value, tenantId: event.data.TenantId, tenantName: event.data.TenantName});
      // if(event.data.ShopID && event.data.ShopName)
      //   this.dashboardService.showShopDetailDashboard({shopId: event.data.ShopID, buildingId: this.form.get('BuildingId').value, shopName: event.data.ShopName});
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    //this.dashboardService.destroyShopList();
  }

}
