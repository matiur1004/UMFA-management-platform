import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CONFIRM_MODAL_CONFIG } from '@core/config/modal.config';
import { IAmrMeter, IScadaRequestDetail, IScadaScheduleStatus } from '@core/models';
import { UmfaUtils } from '@core/utils/umfa.utils';
import { MeterService } from '@shared/services';
import { AMRScheduleService } from '@shared/services/amr-schedule.service';
import moment from 'moment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-amr-meter-assignment-edit',
  templateUrl: './amr-meter-assignment-edit.component.html',
  styleUrls: ['./amr-meter-assignment-edit.component.scss']
})
export class AmrMeterAssignmentEditComponent implements OnInit {

  data: any;
  amrMeterItems: any[] = [];
  meters: IAmrMeter[] = [];
  meterAssignmentDetail: IScadaRequestDetail;
  scheduleStatus: IScadaScheduleStatus[] = [];

  form: UntypedFormGroup;
  selectedMeter: IAmrMeter;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public matDialogRef: MatDialogRef<AmrMeterAssignmentEditComponent>,
    private _formBuilder: UntypedFormBuilder,
    private meterService: MeterService,
    private amrScheduleService: AMRScheduleService,
    private _ufUtils: UmfaUtils,
  ) { 
    this.data = data;
  }

  ngOnInit(): void {
    this.meterService.getMetersForUser(this.data.userId).subscribe(res => this.meters = res);
    // Prepare the card form
    this.form = this._formBuilder.group({
      Id: [0],
      HeaderId: [this.data.headerId],
      AmrScadaUserId: [this.data.userId],
      AmrMeterId: [null, [Validators.required]],
      AmrDescription: [''],
      Status: [1],
      Active: [1],
      UpdateFrequency: [0],
      LastDataDate: [null],
      LastRunDTM: [moment(new Date()).format('YYYY-MM-DD')]
    })
    
    this.scheduleStatus = this.data.scheduleStatus;
    this.meters = this.data.meters;
    if(this.data.detail) {
      this.meterAssignmentDetail = this.data.detail;
      
      this.form.patchValue(this.meterAssignmentDetail);
      this.form.get('LastRunDTM').setValue(moment(this.meterAssignmentDetail.LastRunDTM).format('YYYY-MM-DD'));
      this.form.get('LastDataDate').setValue(moment(this.meterAssignmentDetail.LastDataDate).format('YYYY-MM-DD'));
      this.selectedMeter = this.meters.find(meter => meter.Id == this.meterAssignmentDetail.AmrMeterId);
      if(this.selectedMeter) {
        this.form.get('AmrDescription').setValue(this.selectedMeter.Description);
      }
    }
  }

  onChangeAMRMeter(event) {
    this.selectedMeter = event;
    this.form.get('AmrDescription').setValue(event.Description);
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
          delete this.form.value['AmrDescription'];
          this.matDialogRef.close(this.form.value);
        } else {
          this.matDialogRef.close();
        }
      });
    } 
  }

  onResetStatus() {
    const dialogRef = this._ufUtils.fuseConfirmDialog(
      CONFIRM_MODAL_CONFIG,
      '', 
      `Are you sure you will reset status?`);
    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if(result == 'confirmed') {
        this.amrScheduleService.updateRequestDetailStatus(this.meterAssignmentDetail.Id)
          .subscribe(() => {})
      } else {
      }
    });
    
  }
}
