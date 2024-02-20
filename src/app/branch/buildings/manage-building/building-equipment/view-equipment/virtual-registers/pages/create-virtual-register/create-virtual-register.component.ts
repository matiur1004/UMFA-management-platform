import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {MeterService} from '@app/branch/buildings/manage-building/building-equipment/shared/meter.service';
import {
  MeterListFilterParameters,
  MeterViewModel,
  VirtualRegisterDetail,
  VirtualRegisterType,
  vrTypes
} from '@app/branch/buildings/manage-building/building-equipment/shared/models';
import * as equipmentActions
  from '@app/branch/buildings/manage-building/building-equipment/shared/store/actions/equipment.actions';
import * as virtualRegistersActions
  from '@app/branch/buildings/manage-building/building-equipment/shared/store/actions/virtual-registers.action';
import * as fromEquipment from '@app/branch/buildings/manage-building/building-equipment/shared/store/reducers';
import * as virtualRegisters
  from '@app/branch/buildings/manage-building/building-equipment/shared/store/selectors/virtual-registers.selectors';

import * as virtualRegistersState
  from '@app/branch/buildings/manage-building/building-equipment/shared/store/state/virtual-registers.state';
import * as commonData from '@app/branch/buildings/manage-building/shared/store/selectors/common-data.selectors';
import * as selectors from '@app/branch/buildings/manage-building/tariffs/store/selectors';
import {PopupCommentComponent} from '@app/popups/popup.comment/popup.comment.component';
import {PagingOptions} from '@app/shared/models/paging-options.model';
import {HistoryViewModel, SupplyToViewModel, UnitOfMeasurement} from '@models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {VirtualRegisterMeter} from 'app/branch/buildings/manage-building/building-equipment/shared/models/virtual-register.model';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {SearchFilterAssignedMetersModel} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/virtual-registers/shared/models/filter-meter.model';
import {StringExtension} from '@app/shared/helper';

@Component({
  selector: 'create-virtual-register',
  templateUrl: './create-virtual-register.component.html',
  styleUrls: ['./create-virtual-register.component.less']
})
export class CreateVirtualRegisterComponent implements OnInit, OnDestroy {
  createVRForm: FormGroup;
  showAllErrors = false;
  VirtualRegister = VirtualRegisterType;
  vrTypes = vrTypes;
  unitOptions$: Observable<any[]>;
  unitsOfMeasurement$: Observable<UnitOfMeasurement[]>;
  equipmentList$: Observable<MeterViewModel[]>;
  total$: Observable<number>;
  virtualRegisterType: VirtualRegisterType = VirtualRegisterType.MeterTotal;
  amrUnitsOfMeasurement$: Observable<UnitOfMeasurement[]>;
  selectedVirtualRegister: VirtualRegisterDetail;
  assignedMeters: VirtualRegisterMeter[] = [];
  total = 0;
  equipmentSource$: Observable<MeterViewModel[]>;
  buildingId: string;
  suppliers$: Observable<SupplyToViewModel[]>;
  buildingPeriodIsFinalized$: Observable<any>;
  private selectedVersionSub: Subscription;
  private selectedVersion: HistoryViewModel;
  private createVRFormSub: Subscription;
  private storeVrSub: Subscription;

  constructor(private fb: FormBuilder,
              private meterService: MeterService,
              private route: ActivatedRoute,
              private activeRouter: ActivatedRoute,
              private store: Store<fromEquipment.State>,
              private storeVr$: Store<virtualRegistersState.State>,
              private modalService: NgbModal) {
    this.createVRForm = this.fb.group({
      type: this.fb.control(0, [Validators.required]),
    });
  }

  get unitOfMeasurement() {
    return this.createVRForm.get('unitOfMeasurement');
  }

  ngOnInit() {
    this.buildingId = this.route.pathFromRoot[4].snapshot.paramMap.get('id');
    this.suppliers$ = this.meterService.getSupplies(this.buildingId, null).pipe(
      map(suppliers => {
        return this.getLocationTypes(suppliers);
      })
    );
    this.storeVrSub = this.storeVr$.pipe(select(virtualRegisters.getSelectedVirtualRegister)).subscribe((vr: VirtualRegisterDetail) => {
      if (vr) {
        this.selectedVirtualRegister = vr;
        this.assignedMeters = vr.assignedMeters;
        this.createVRForm.patchValue({
          type: this.selectedVirtualRegister.type,
        });
        this.createVRForm.controls.type.disable();
        this.checkFormTypeValue(this.createVRForm.controls.type.value);
      }
    });

    this.unitsOfMeasurement$ = this.store.pipe(select(selectors.getAllUnitsOfMeasurements));
    this.amrUnitsOfMeasurement$ = this.store.pipe(select(selectors.getAmrUnitsOfMeasurements));
    this.unitOptions$ = this.store.pipe(select(fromEquipment.getEquipmentUnitOptions));
    this.equipmentList$ = this.store.pipe(select(fromEquipment.getEquipmentList));
    this.equipmentSource$ = this.getEquipmentSource();
    this.total$ = this.store.pipe(select(fromEquipment.getEquipmentsTotal));
    this.createVRFormSub = this.createVRForm.controls['type'].valueChanges.subscribe(type => this.checkFormTypeValue(type));
    this.selectedVersionSub = this.store.pipe(select(commonData.getSelectedHistoryLog))
      .subscribe((version: HistoryViewModel) => this.selectedVersion = version);

    this.buildingPeriodIsFinalized$ = this.store.pipe(select(commonData.getIsFinalized));
  }

  getEquipmentSource(): Observable<MeterViewModel[]> {
    return this.store.pipe(
      select(fromEquipment.getEquipmentList),
      map(source => {
        if (this.createVRForm.controls['type'].value === VirtualRegisterType.SignalMeter
          && this.createVRForm.contains('signalMeterConfig')) {
          const signalMeterId = (this.createVRForm.controls.signalMeterConfig as FormGroup).controls['signalMeterId'].value;
          if (signalMeterId) {
            return source.filter(m => m.id !== signalMeterId);
          }
        }

        return source;
      })
    );
  }

  checkFormTypeValue(type) {
    switch (type) {
      case VirtualRegisterType.MeterTotal:
        this.virtualRegisterType = VirtualRegisterType.MeterTotal;
        break;

      case VirtualRegisterType.SignalMeter:
        this.virtualRegisterType = VirtualRegisterType.SignalMeter;
        break;

      default:
        this.virtualRegisterType = VirtualRegisterType.MeterTotal;
        break;
    }
  }

  ngOnDestroy(): void {
    this.storeVr$.dispatch(new virtualRegistersActions.SetVirtualRegisterDetailSuccess(null));

    if (this.storeVrSub) {
      this.storeVrSub.unsubscribe();
    }

    if (this.createVRFormSub) {
      this.createVRFormSub.unsubscribe();
    }
  }

  onSave() {
    if (this.createVRForm.invalid) {
      this.showAllErrors = true;
      return;
    }

    const virtualRegister: VirtualRegisterDetail = {
      ...this.createVRForm.getRawValue(),
      assignedMeters: this.assignedMeters,
    };

    if (this.selectedVirtualRegister) {
      virtualRegister.id = this.selectedVirtualRegister.id;
    } else {
      virtualRegister.id = StringExtension.NewGuid();
    }

    this.onOpenVersionPopup(virtualRegister);
  }

  onAssignMeter($event) {
    this.assignedMeters = [];
    if ($event.length) {
      $event.map(item => {
        const meterIdx = this.assignedMeters.findIndex(meterItem => meterItem.meterId === item.id);
        if (item.isAssigned) {
          if (meterIdx === -1) {
            this.assignedMeters.push({
              meterId: item.id,
              useForBilling: item.useForBilling
            });
          } else {
            this.assignedMeters[meterIdx].useForBilling = item.useForBilling;
          }
        } else {
          this.assignedMeters.splice(meterIdx, 1);
        }
      });
    }
  }

  onOpenVersionPopup(virtualRegister) {
    const modalRef = this.modalService.open(PopupCommentComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });
    modalRef.componentInstance.date = new Date();
    modalRef.componentInstance.comment = this.selectedVersion.comment;
    modalRef.result.then(({comment, date, actionType}) => {
      const meter = {
        entity: virtualRegister,
        id: this.selectedVersion.id,
        majorVersion: 1,
        action: actionType,
        versionDate: date ? new Date(date) : this.selectedVersion.startDate,
        comment: comment
      };
      if (!this.selectedVirtualRegister) {
        this.store.dispatch(new virtualRegistersActions.CreateVirtualRegister(meter));
      } else {
        this.store.dispatch(new virtualRegistersActions.UpdateVirtualRegister(meter));
      }
    }, () => {
    });
  }

  requestEquipmentList(pagingPayload?: PagingOptions<MeterListFilterParameters>) {
    const payload: PagingOptions<MeterListFilterParameters> = {
      requestParameters: pagingPayload ? pagingPayload.requestParameters : new MeterListFilterParameters(),
      skip: pagingPayload ? pagingPayload.skip : 0,
      take: pagingPayload ? pagingPayload.take : 30
    };

    if (this.unitOfMeasurement && this.createVRForm.controls['type'].value !== VirtualRegisterType.SignalMeter) {
      payload.requestParameters.unitOfMeasurement = this.unitOfMeasurement.value;
    }

    if (this.createVRForm.controls['type'].value === VirtualRegisterType.SignalMeter) {
      payload.requestParameters.onlyAMRSource = true;
    }

    this.store.dispatch(new equipmentActions.RequestEquipmentList(payload));
  }

  onCancel() {
    this.store.dispatch(new virtualRegistersActions.CloseUpdateVirtualRegister());
  }

  onApplyFilter(searchData: SearchFilterAssignedMetersModel) {
    const payload: PagingOptions<MeterListFilterParameters> = {
      requestParameters: new MeterListFilterParameters(),
      skip: 0,
      take: 30
    };


    searchData.vrId = this.selectedVirtualRegister ? this.selectedVirtualRegister.id : null;
    payload.requestParameters.filter = searchData;

    this.requestEquipmentList(payload);
  }

  private getLocationTypes(suppliers: SupplyToViewModel[]) {
    return suppliers.map(s => {
      return {
        ...s,
        locationTypes: s.supplyTypes.reduce((locationTypes, supplyType) => {
          locationTypes.push(...supplyType.supplyToLocations);
          return locationTypes;
        }, [])
      };
    });
  }
}
