import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AllowedPageSizes } from '@core/helpers';
import themes from 'devextreme/ui/themes';

@Component({
  selector: 'app-tenant-slip-detail',
  templateUrl: './tenant-slip-detail.component.html',
  styleUrls: ['./tenant-slip-detail.component.scss']
})
export class TenantSlipDetailComponent implements OnInit {

  readonly allowedPageSizes = AllowedPageSizes;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  isVisibleCustomFileFormat: boolean = false;
  form: UntypedFormGroup;
  periodList: any;
  reportTypeList: any;
  fileFormatList: any;
  tenantList:any;
  buildingId: any;
  tenantShopList: any;
  tenantSlipsReportsDataSource: any;

  checkBoxesMode: string;

  custPeriodTemplate = (arg: any) => {
    const datepipe: DatePipe = new DatePipe('en-ZA');
    var ret = "<div class='custom-item' title='(" + arg.DisplayName + ")'>" + arg.DisplayName + "</div>";
    return ret;
  }
  
  constructor(
    private _service: DashboardService,
    private _formBuilder: UntypedFormBuilder,
    private _cdr: ChangeDetectorRef
  ) { 
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      PeriodId: [null, Validators.required],
      ReportTypeId: [null, Validators.required],
      FileFormat: [null],
      FileName: [null],
      CustomFileFormat: [null]
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

    this._service.tenantSlipsReports$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res){
          this.tenantSlipsReportsDataSource = res['Slips'];
          this._cdr.detectChanges();
        }
      });
  }

  valueChanged(e: any, method: string) {
    if(method == 'Period') {
      this._service.getTenantsWithBuildingAndPeriod(this.buildingId, this.form.get('PeriodId').value).subscribe();
    } else if(method == 'Tenant') {
      
    } else if(method == 'ReportType') {
      
    } else if(method == 'FileFormat') {
      let fileFormatItem = this.fileFormatList.find(obj => obj.Id == this.form.get('FileFormat').value);
      if(fileFormatItem['Value'] == 'Custom') {
        this.isVisibleCustomFileFormat = true;
      } else this.isVisibleCustomFileFormat = false;
    }
  }

  viewSelection() {
    this._service.getTenantSlipsReports(this.buildingId, this.form.get('PeriodId').value, this.form.get('ReportTypeId').value).subscribe();
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
