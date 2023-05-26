import { Component, OnInit } from '@angular/core';
import { AllowedPageSizes } from '@core/helpers';
import { IScadaJobStatus, IScadaRequestHeader, IScadaScheduleStatus } from '@core/models';
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
  scheduleHeaderStatus: IScadaScheduleStatus[] = [];
  jobStatus: IScadaJobStatus[] = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private _amrScheduleService: AMRScheduleService, private _router: Router) { 
    this.onEdit = this.onEdit.bind(this);
  }

  ngOnInit(): void {
    this._amrScheduleService.scheduleStatus$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.scheduleHeaderStatus = data;
      })
    
    this._amrScheduleService.jobStatus$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.jobStatus = data;
      })

    this._amrScheduleService.scadaRequestHeaders$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: IScadaRequestHeader[]) => {
          this.scadaRequestHeaders = data;
          this.scadaRequestHeaders = this.scadaRequestHeaders.map(item => {
            let statusItem = this.scheduleHeaderStatus.find(obj => obj.Id == item.Status);
            let jobItem = this.jobStatus.find(job => job.Id == item.JobType);
            return {...item, StatusLabel: statusItem.Name, JobLabel: jobItem.Name};
          })
      })

    
  }

  onScheduleListPrepared(event) {
    if (event.rowType === "data") {
      let statusItem = this.scheduleHeaderStatus.find(obj => obj.Id == event.data.Status);
      event.statusLabel = statusItem.Name;
    }
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
