import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CONFIRM_MODAL_CONFIG } from '@core/config/modal.config';
import { IAmrMeter, IScadaRequestDetail, IScadaScheduleStatus } from '@core/models';
import { UmfaUtils } from '@core/utils/umfa.utils';
import { MeterService } from '@shared/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-amr-meter-assignment-edit',
  templateUrl: './amr-meter-assignment-edit.component.html',
  styleUrls: ['./amr-meter-assignment-edit.component.scss']
})
export class AmrMeterAssignmentEditComponent implements OnInit {

  data: any;
  amrMeterItems: any[] = [];
  meters$: Observable<IAmrMeter[]>;
  meterAssignmentDetail: IScadaRequestDetail;
  scheduleStatus: IScadaScheduleStatus[] = [];

  form: UntypedFormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public matDialogRef: MatDialogRef<AmrMeterAssignmentEditComponent>,
    private _formBuilder: UntypedFormBuilder,
    private meterService: MeterService,
    private _ufUtils: UmfaUtils,
  ) { 
    this.data = data;
  }

  ngOnInit(): void {
    this.meters$ =  this.meterService.getMetersForUser(this.data.userId);
    // Prepare the card form
    this.form = this._formBuilder.group({
      AmrMeterId: [],
      Description: [''],
      UpdateFrequency: [0]
    })
    if(this.data.detail) {
      this.meterAssignmentDetail = this.data.detail;
      this.scheduleStatus = this.data.scheduleStatus;
      this.form.patchValue(this.meterAssignmentDetail);
    }
  }

  close(): void {
    this.matDialogRef.close();
  }

  getNameFromList(id: number, list) {
    let filter = list.find(obj => obj.Id == id);
    if(filter) return filter['Name'];
    return '';
  }

  submit() {
    if(this.form.valid) {
      const dialogRef = this._ufUtils.fuseConfirmDialog(
        CONFIRM_MODAL_CONFIG,
        '', 
        `Are you sure you need to ${this.data.detail ? 'update' : 'create'}?`);
      // Subscribe to afterClosed from the dialog reference
      dialogRef.afterClosed().subscribe((result) => {
        if(result == 'confirmed') {
          this.matDialogRef.close(this.form.value);
        } else {
          this.matDialogRef.close();
        }
      });
    } 
  }
}
