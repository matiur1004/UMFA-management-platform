import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tenant-slip-dashboard',
  templateUrl: './tenant-slip-dashboard.component.html',
  styleUrls: ['./tenant-slip-dashboard.component.scss']
})
export class TenantSlipDashboardComponent implements OnInit {

  @Input() criteria: any;
  
  tenantSlipData: any;
  headerDetail: any;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _service: DashboardService,
    private _cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    let data = {
      periodId: this.criteria.periodId,
      tenantId: this.criteria.tenantId,
      ShopIDs: [0],
      SplitIndicator: -1
    };
    this._service.getTenantSlipData(data).subscribe();

    this._service.tenantSlipData$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          this.tenantSlipData = res;
          this.headerDetail = this.tenantSlipData['Header'];
          this._cdr.detectChanges();
          console.log('tenantslip data', this.tenantSlipData);
        }
      })
  }

}
