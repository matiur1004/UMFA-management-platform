import { Component, OnInit } from '@angular/core';
import { AllowedPageSizes } from '@core/helpers';
import { IAmrSchedule } from '@core/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-amr-schedule',
  templateUrl: './amr-schedule.component.html',
  styleUrls: ['./amr-schedule.component.scss']
})
export class AmrScheduleComponent implements OnInit {

  readonly allowedPageSizes = AllowedPageSizes;
  
  schedules$: Observable<IAmrSchedule[]>;
  
  constructor() { 
    this.onEdit = this.onEdit.bind(this);
  }

  ngOnInit(): void {
  }

  onEdit(e) {
    e.event.preventDefault();
    //this._router.navigate([`/admin/amrMeter/edit/${this.user.Id}/${e.row.data.Id}`]);
  }

}
