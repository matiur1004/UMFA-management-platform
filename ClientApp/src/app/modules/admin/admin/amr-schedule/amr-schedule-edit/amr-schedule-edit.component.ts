import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IScadaRequestHeader } from '@core/models';
import { AMRScheduleService } from '@shared/services/amr-schedule.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-amr-schedule-edit',
  templateUrl: './amr-schedule-edit.component.html',
  styleUrls: ['./amr-schedule-edit.component.scss']
})
export class AmrScheduleEditComponent implements OnInit {

  form: UntypedFormGroup;
  scheduleHeaderDetail: IScadaRequestHeader;
  jobTypeItems = [{Label: 'Profile Data Retrieval', Id: 1}, {Label: 'Reading Data Retrieval', Id: 2}];

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _amrScheduleService: AMRScheduleService,
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      Id: [0],
      JobType: [],
      Interval: []
    });

    this._amrScheduleService.scadaRequestHeaderDetail$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: IScadaRequestHeader) => {
          this.scheduleHeaderDetail = data;
          if(this.scheduleHeaderDetail) {
            this.form.patchValue(this.scheduleHeaderDetail);
          }
      })
  }
  onDelete() {

  }

  onSave() {

  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
