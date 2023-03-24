import { Component, OnInit } from '@angular/core';
import { AllowedPageSizes } from '@core/helpers';
import { IScadaRequestHeader } from '@core/models';
import { AMRScheduleService } from '@shared/services/amr-schedule.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-amr-schedule',
  templateUrl: './amr-schedule.component.html',
  styleUrls: ['./amr-schedule.component.scss']
})
export class AmrScheduleComponent implements OnInit {

  readonly allowedPageSizes = AllowedPageSizes;
  
  scadaRequestHeaders: IScadaRequestHeader[] = [];
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private _amrScheduleService: AMRScheduleService, private _router: Router) { 
    this.onEdit = this.onEdit.bind(this);
  }

  ngOnInit(): void {

    this._amrScheduleService.scadaRequestHeaders$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: IScadaRequestHeader[]) => {
          this.scadaRequestHeaders = data;
      })
  }

  onCustomizeDateTime(cellInfo) {
    return moment(new Date(cellInfo.value)).format('YYYY-MM-DD mm:hh:ss');
  }

  onEdit(e) {
    e.event.preventDefault();
    this._router.navigate([`/admin/amrSchedule/edit/${e.row.data.Id}`]);
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
