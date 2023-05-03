import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CONFIRM_MODAL_CONFIG } from '@core/config/modal.config';
import { IAmrMeter, IScadaRequestDetail, IScadaScheduleStatus, IUmfaBuilding } from '@core/models';
import { UmfaUtils } from '@core/utils/umfa.utils';
import { MeterService } from '@shared/services';
import { AMRScheduleService } from '@shared/services/amr-schedule.service';
import moment from 'moment';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-amr-meter-assignment-edit',
  templateUrl: './amr-meter-assignment-edit.component.html',
  styleUrls: ['./amr-meter-assignment-edit.component.scss']
})
export class AmrMeterAssignmentEditComponent implements OnInit {

  data: any;
  amrMeterItems: any[] = [];
  buildings: IUmfaBuilding[] = [];
  meters: IAmrMeter[] = [];
  meterAssignmentDetail: IScadaRequestDetail;
  scheduleStatus: IScadaScheduleStatus[] = [];

  form: UntypedFormGroup;
  selectedMeter: IAmrMeter;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public matDialogRef: MatDialogRef<AmrMeterAssignmentEditComponent>,
    private _formBuilder: UntypedFormBuilder,
    private amrScheduleService: AMRScheduleService,
    private _ufUtils: UmfaUtils,
    private _cdr: ChangeDetectorRef
  ) { 
    this.data = data;
  }

  ngOnInit(): void {
    // Prepare the card form
    this.form = this._formBuilder.group({
      Id: [0],
      BuildingId: [],
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
    this.buildings = this.data.buildings;
    if(this.data.detail) {
      this.meterAssignmentDetail = this.data.detail;
      
      this.form.patchValue(this.meterAssignmentDetail);
      this.form.get('LastRunDTM').setValue(moment(this.meterAssignmentDetail.LastRunDTM).format('YYYY-MM-DD'));
      this.form.get('LastDataDate').setValue(moment(this.meterAssignmentDetail.LastDataDate).format('YYYY-MM-DD'));
      this.selectedMeter = this.meterAssignmentDetail.AmrMeter;
      this.meters = [this.selectedMeter];
      this._cdr.detectChanges();
      if(this.selectedMeter) {
        this.form.get('AmrMeterId').setValue(this.selectedMeter.Id);
        this.form.get('AmrDescription').setValue(this.selectedMeter.Description);
      }
    }

    this.amrScheduleService.meters$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.meters = data;
      })
  }

  onChangeBuilding(event) {
    this.amrScheduleService.getAmrMetersForBuilding(event.BuildingId).subscribe();
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

  customSearch(term: string, item: any) {
    term = term.toLowerCase();
    return item.Name.toLowerCase().indexOf(term) > -1;
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

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
