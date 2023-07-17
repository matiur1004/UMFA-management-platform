import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';
import { AllowedPageSizes } from '@core/helpers';
import themes from 'devextreme/ui/themes';
import moment from 'moment';

@Component({
  selector: 'app-tenant-slip-downloads',
  templateUrl: './tenant-slip-downloads.component.html',
  styleUrls: ['./tenant-slip-downloads.component.scss']
})
export class TenantSlipDownloadsComponent implements OnInit {

  readonly allowedPageSizes = AllowedPageSizes;
  
  checkBoxesMode: string;
  
  applyFilterTypes: any;
  currentFilter: any;
  dataSource: any;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _service: DashboardService,
  ) {
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
    this.applyFilterTypes = [{
        key: 'auto',
        name: 'Immediately',
    }, {
        key: 'onClick',
        name: 'On Button Click',
    }];
    this.currentFilter = this.applyFilterTypes[0].key;
    this.onDownload = this.onDownload.bind(this);
   }

  ngOnInit(): void {
    this._service.reportsArchives$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        console.log(res);
        if(res) this.dataSource = res;
      });
  }

  onDownload(e) {
    e.event.preventDefault();
  }

  onCustomizeDateTime(cellInfo) {
    return moment(new Date(cellInfo.value)).format('YYYY-MM-DD mm:hh:ss');
  }
}
