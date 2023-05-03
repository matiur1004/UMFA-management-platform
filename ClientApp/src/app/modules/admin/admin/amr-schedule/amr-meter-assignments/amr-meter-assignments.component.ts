import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CONFIRM_MODAL_CONFIG } from '@core/config/modal.config';
import { AllowedPageSizes } from '@core/helpers';
import { IAmrMeter, IopUser, IScadaRequestDetail, IScadaScheduleStatus, IUmfaBuilding } from '@core/models';
import { UmfaUtils } from '@core/utils/umfa.utils';
import { BuildingService, MeterService, UserService } from '@shared/services';
import { AMRScheduleService } from '@shared/services/amr-schedule.service';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { AmrMeterAssignmentEditComponent } from '../amr-meter-assignment-edit/amr-meter-assignment-edit.component';

@Component({
  selector: 'app-amr-meter-assignments',
  templateUrl: './amr-meter-assignments.component.html',
  styleUrls: ['./amr-meter-assignments.component.scss']
})
export class AmrMeterAssignmentsComponent implements OnInit {

  scadaRequestDetails: IScadaRequestDetail[] = [];
  headerId: number;
  user: IopUser;
  scheduleStatus: IScadaScheduleStatus[] = [];
  buildings: IUmfaBuilding[] = [];
  readonly allowedPageSizes = AllowedPageSizes;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _router: Router, 
    private _amrScheduleService: AMRScheduleService, 
    private actRoute: ActivatedRoute, 
    private _matDialog: MatDialog,
    private userService: UserService,
    private _buildingService: BuildingService,
    private meterService: MeterService,
    private _ufUtils: UmfaUtils
  ) {
    this.onEdit = this.onEdit.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.user = this.userService.userValue;
  }

  ngOnInit(): void {
    this.actRoute.params.subscribe(params => {
      this.headerId = +params['id'];
    })

    this._amrScheduleService.scheduleStatus$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.scheduleStatus = data;
      })

    // this.meterService.meters$
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((data: any) => {
    //     this.meters = data;
    //   })
    
    this._buildingService.buildings$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: IUmfaBuilding[]) => {
        this.buildings = data;
      })

    this._amrScheduleService.scadaRequestDetails$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: IScadaRequestDetail[]) => {
          this.scadaRequestDetails = data;
          this.scadaRequestDetails = this.scadaRequestDetails.map(item => {
            let statusItem = this.scheduleStatus.find(obj => obj.Id == item.Status);
            return {...item, StatusLabel: statusItem? statusItem.Name : ''};
          })
      })
  }

  onEdit(e) {
    e.event.preventDefault();
    this._matDialog.open(AmrMeterAssignmentEditComponent, {autoFocus: false, data: 
      {
        userId: this.user.Id,
        detail: e.row.data,
        scheduleStatus: this.scheduleStatus,
        buildings: this.buildings,
        headerId: this.headerId
      }})
      .afterClosed()
      .subscribe((res) => {
        if(res) {
          res['LastDataDate'] = new Date(res['LastDataDate']).toISOString();
          res['LastRunDTM'] = new Date().toISOString();
          res['CurrentRunDTM'] = new Date().toISOString();
          res['Active'] = 1;          
          console.log(res);
          this._amrScheduleService.createOrUpdateRequestDetailTable(res)
            .subscribe(() => {
              this._amrScheduleService.getScadaRequestDetails(this.headerId).subscribe();
            });  
        }
      });
  }

  onAdd() {
    this._matDialog.open(AmrMeterAssignmentEditComponent, {autoFocus: false, data: 
      {
        userId: this.user.Id,
        detail: null,
        scheduleStatus: this.scheduleStatus,
        buildings: this.buildings,
        headerId: this.headerId
      }})
      .afterClosed()
      .subscribe((res) => {
        if(res) {
          res['LastDataDate'] = new Date(res['LastDataDate']).toISOString();
          res['LastRunDTM'] = new Date().toISOString();
          res['CurrentRunDTM'] = new Date().toISOString();  
          res['Active'] = 1;
          this._amrScheduleService.createOrUpdateRequestDetailTable(res)
            .subscribe(() => {
              this._amrScheduleService.getScadaRequestDetails(this.headerId).subscribe();
            });  
        }
      });
  }

  onRemove(e) {
    e.event.preventDefault();
    const dialogRef = this._ufUtils.fuseConfirmDialog(
      CONFIRM_MODAL_CONFIG,
      '', 
      `Are you sure you need to remove?`);
    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if(result == 'confirmed') {
        this._amrScheduleService.deleteScadaRequestDetail(e.row.data.Id)
          .subscribe(() => {
            this._amrScheduleService.getScadaRequestDetails(this.headerId).subscribe();
          })
      } else {
      }
    });

  }

  onCustomizeDateTime(cellInfo) {
    return moment(new Date(cellInfo.value)).format('YYYY-MM-DD mm:hh:ss');
  }

  back() {
    this._router.navigate([`/admin/amrSchedule/edit/${this.headerId}`]);
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
