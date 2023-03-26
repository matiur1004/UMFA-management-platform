import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CONFIRM_MODAL_CONFIG } from '@core/config/modal.config';
import { IScadaRequestHeader, IScadaScheduleStatus } from '@core/models';
import { UmfaUtils } from '@core/utils/umfa.utils';
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
  scheduleHeaderStatus: IScadaScheduleStatus[] = [];
  jobTypeItems = [{Label: 'Profile Data Retrieval', Id: 1}, {Label: 'Reading Data Retrieval', Id: 2}];

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _amrScheduleService: AMRScheduleService,
    private _router: Router,
    private _ufUtils: UmfaUtils
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      Id: [0],
      JobType: [],
      Interval: [],
      Status: [0],
      Active: [1],
      Description: [''],

    });

    this._amrScheduleService.scadaRequestHeaderDetail$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: IScadaRequestHeader) => {
          this.scheduleHeaderDetail = data;
          if(this.scheduleHeaderDetail) {
            this.form.patchValue(this.scheduleHeaderDetail);
          }
      })

    this._amrScheduleService.scheduleStatus$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.scheduleHeaderStatus = data;
      })

  }
  onDelete() {
    //this._router.na
    const dialogRef = this._ufUtils.fuseConfirmDialog(
      CONFIRM_MODAL_CONFIG,
      '', 
      `Are you sure you need to remove?`);
    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if(result == 'confirmed') {
        this._amrScheduleService.deleteScadaRequestHeader(this.scheduleHeaderDetail.Id)
          .subscribe(() => {
            this._router.navigate([`/admin/amrSchedule`]);
          })
      }
    });
  }

  onSave() {

  }

  getNameFromList(id: number, list){
    let filter = list.find(obj => obj.Id == id);
    if(filter) return filter['Name'];
    return '';
  }

  onMeterAssignments() {
    this._router.navigate([`/admin/amrSchedule/edit/${this.scheduleHeaderDetail.Id}/meterAssignment`]);
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
