import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tenant-slip-detail',
  templateUrl: './tenant-slip-detail.component.html',
  styleUrls: ['./tenant-slip-detail.component.scss']
})
export class TenantSlipDetailComponent implements OnInit {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  isVisibleCustomFileFormat: boolean = false;
  form: UntypedFormGroup;
  periodList: any;
  reportTypeList: any;
  fileFormatList: any;
  tenantList:any;
  buildingId: any;
  tenantShopList: any;

  custPeriodTemplate = (arg: any) => {
    const datepipe: DatePipe = new DatePipe('en-ZA');
    var ret = "<div class='custom-item' title='(" + arg.DisplayName + ")'>" + arg.DisplayName + "</div>";
    return ret;
  }
  
  constructor(
    private _service: DashboardService,
    private _formBuilder: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      PeriodId: [null, Validators.required],
      ReportTypeId: [null],
      FileFormat: [null],
      FileName: [null],
      TenantId: [null],
      TenantShop: [null]
    });
    this._service.tenantSlipCriteria$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          this.periodList = res['PeriodLists'];
          this.reportTypeList = res['ReportTypes'];
          this.fileFormatList = res['FileFormats'];
          this.form.get('FileName').setValue(res['FileName']);
          this.buildingId = res['BuildingId'];
        }
      })

    this._service.tenantSlipTenants$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.tenantList = res;
      });

    this._service.tenantSlipTenantShops$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.tenantShopList = res;
      });
  }

  valueChanged(e: any, method: string) {
    if(method == 'Period') {
      this._service.getTenantsWithBuildingAndPeriod(this.buildingId, this.form.get('PeriodId').value).subscribe();
    } else if(method == 'Tenant') {
      if(this.form.get('ReportTypeId').value)
        this._service.getTenantShops(this.buildingId, this.form.get('PeriodId').value, this.form.get('TenantId').value, this.form.get('ReportTypeId').value).subscribe();
    } else if(method == 'ReportType') {
      if(this.form.get('TenantId').value)
        this._service.getTenantShops(this.buildingId, this.form.get('PeriodId').value, this.form.get('TenantId').value, this.form.get('ReportTypeId').value).subscribe();
    } else if(method == 'FileFormat') {
      let fileFormatItem = this.fileFormatList.find(obj => obj.Id == this.form.get('FileFormat').value);
      if(fileFormatItem['Value'] == 'Custom') {
        this.isVisibleCustomFileFormat = true;
      } else this.isVisibleCustomFileFormat = false;
    }
  }
  /**
     * On destroy
     */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }
}
