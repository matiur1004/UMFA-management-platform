import {Injectable} from '@angular/core';
import {convertAnyToParams} from '@app/shared/helper/http-helper';
import {PagingOptions} from '@app/shared/models/paging-options.model';
import {
  PagingViewModel,
  RegisterViewModel,
  SupplyToViewModel,
  SupplyType,
  UnitType,
  VersionActionType,
  VersionViewModel
} from '@models';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {ApplyResultService} from 'app/popups/apply-result-popup/apply-result.service';
import {box, DisableAction, EnableAction, SetValueAction, unbox} from 'ngrx-forms';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import * as commonDataActions from '../../../../shared/store/actions/common-data.action';
import * as commonData from '../../../../shared/store/selectors/common-data.selectors';
import {BuildingEquipmentTemplateService} from '../../building-equipment-template.service';
import {LocationEquipmentService} from '../../location-equipment.service';
import {MeterService} from '../../meter.service';
import {
  BreakerState,
  MeterDetailViewModel,
  MeterListFilterParameters,
  MeterPhotoType,
  MeterRegisterViewModel,
  MeterViewModel,
  MeterWriteViewModel,
  VirtualRegisterType,
} from '../../models';
import * as equipmentFormActions from '../actions/equipment-form.actions';
import * as equipmentActions from '../actions/equipment.actions';

import * as fromEquipment from '../reducers';
import * as equipmentFormStore from '../reducers/equipment-form.store';
import {isBreaker} from '../utilities/equipment-type-resolver';
import {BranchSettingsService, EquipmentService} from '@services';
import {isTargetMeterExist,} from '@app/branch/buildings/manage-building/building-equipment/shared/store/utilities/registers';
import {RemoveDialogComponent} from '../../../view-equipment/equipment-details/remove-dialog/remove-dialog.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfimationPopupActions, ConfirmationPopupMessage} from '@app/shared/models/confirmation-popup-message.model';
import {BuildingPeriodViewModel} from '@app/branch/buildings/manage-building/shared/models/building-period.model';
import {convertDateToNgbDate, convertNgbDateToDate} from '@app/shared/helper/date-extension';
import CONNECT_TO_AMR_REQUEST = equipmentFormActions.CONNECT_TO_AMR_REQUEST;
import ConnectToAmrSystemRequestComplete = equipmentFormActions.ConnectToAmrSystemRequestComplete;
import GET_READINGS_FROM_AMR_REQUEST = equipmentFormActions.GET_READINGS_FROM_AMR_REQUEST;
import GetReadingsFromAmrSystemRequestComplete = equipmentFormActions.GetReadingsFromAmrSystemRequestComplete;
import TOGGLE_BREAKER_REQUEST = equipmentFormActions.TOGGLE_BREAKER_REQUEST;
import ToggleBreakerRequestComplete = equipmentFormActions.ToggleBreakerRequestComplete;

import { LocalStorageService } from '@app/shared/services/local-storage.service';

function toggleTechnologyAction(formState) {
  const attributeControls = [...formState.controls.attributes.controls];
  const virtualRegisters = [...formState.value.virtualRegisters];
  const technologyControl = attributeControls.find(controls => controls.value.attribute.name === 'Technology');
  const signalMeter = virtualRegisters.some(vr => !!vr.signalMeterConfig);

  if (signalMeter) {
    return new DisableAction(technologyControl.id);
  }

  return new EnableAction(technologyControl.id);
}

@Injectable()
export class EquipmentEffects {

  // Get list of locations
  getLocations = createEffect(() => this.actions$.pipe(
    ofType(equipmentFormActions.GET_LOCATIONS_REQUEST),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      (_, buildingId, versionId) => {
        return {
          buildingId: buildingId,
          versionId: versionId
        };
      }),
    switchMap(({buildingId, versionId}) => {

      return this.equipmentService.getLocations(buildingId, versionId).pipe(
        map(items => {
          return new equipmentFormActions.GetLocationsRequestComplete(items);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Get list of supplies
  getSupplies = createEffect(() => this.actions$.pipe(
    ofType(equipmentFormActions.GET_SUPPLIES_REQUEST),
    withLatestFrom(this.store$.select(commonData.getBuildingId),
      this.store$.select(fromEquipment.getEquipmentFormFormState), (_, buildingId, equipmentFormState) => {
        return {
          buildingId: buildingId,
          equipmentFormState: equipmentFormState
        };
      }),
    switchMap(({buildingId, equipmentFormState}) => {
      const supplyType = equipmentFormState.value.supplyType;

      if (supplyType == null) {
        return [new equipmentFormActions.GetSuppliesRequestComplete([])];
      }

      return this.equipmentService.getSupplies(buildingId, supplyType).pipe(
        map(items => {
          const suppliesTo = items.map(s => {
            const supplyTo = new SupplyToViewModel();
            supplyTo.id = s.id;
            supplyTo.name = s.name;
            supplyTo.supplyTypes = s.supplyTypes.filter(t => t.supplyType === supplyType);

            return supplyTo;
          });

          return new equipmentFormActions.GetSuppliesRequestComplete(suppliesTo);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Get list of shops
  getShops = createEffect(() => this.actions$.pipe(
    ofType(equipmentFormActions.GET_SHOPS_REQUEST),
    withLatestFrom(this.store$.pipe(select(commonData.getBuildingId)), this.store$.pipe(select(commonData.getSelectedVersionId)),
      (_, buildingId, versionId) => ({buildingId, versionId})
    ),
    switchMap(({buildingId, versionId}) => {

      return this.equipmentService.getShops(buildingId, versionId).pipe(
        map(items => {
          return new equipmentFormActions.GetShopsRequestComplete(items);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Get list of common areas
  getCommonAreas = createEffect(() => this.actions$.pipe(
    ofType(equipmentFormActions.GET_COMMON_AREAS_REQUEST),
    withLatestFrom(this.store$.pipe(select(commonData.getBuildingId)), this.store$.pipe(select(commonData.getSelectedVersionId)),
      (_, buildingId, versionId) => ({buildingId, versionId})
    ),
    switchMap(({buildingId, versionId}) => {
      return this.equipmentService.getCommonAreas(buildingId, versionId).pipe(
        map(items => {
          return new equipmentFormActions.GetCommonAreasRequestSuccess(items);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Get equipment template
  getEquipmentTemplate = createEffect(() => this.actions$.pipe(
    ofType(equipmentFormActions.GET_EQUIPMENT_TEMPLATE_REQUEST),
    withLatestFrom(this.store$.select(commonData.getBuildingId), (action: any, buildingId) => {
      return {
        equipmentTemplateId: action.payload,
        buildingId: buildingId
      };
    }),
    switchMap(({buildingId, equipmentTemplateId}) => {
      return this.equipmentService.getEquipment(buildingId, equipmentTemplateId).pipe(
        map(item => {
          return new equipmentFormActions.GetEquipmentTemplateRequestComplete(item);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Add register
  addRegister = createEffect(() => this.actions$.pipe(
    ofType(equipmentFormActions.ADD_REGISTER),
    withLatestFrom(this.store$.select(fromEquipment.getEquipmentFormFormState),
      this.store$.pipe(select(fromEquipment.getEquipmentEquipmentTemplateRegistersDict)),
      (action: any, equipmentStateForm, equipmentRegisterDict) => {
        return {
          register: {...action.payload, date: convertDateToNgbDate(new Date())},
          formState: equipmentStateForm,
          equipmentRegisterDict
        };
      }),
    switchMap(({register, formState, equipmentRegisterDict}) => {
      const registers: MeterRegisterViewModel[] = [...formState.value.registers, register].map(r => {
        r.unitOfMeasurement = equipmentRegisterDict[r.id].unitOfMeasurement;
        return r;
      });

      // Add register to bulk action
      const virtualRegisters = [...formState.value.virtualRegisters];

      const mappedVirtualRegisters = virtualRegisters.map(vr => {
        const sameTypeRegisters = registers.filter(r => r.unitOfMeasurement === vr.unitOfMeasurement)
          .filter(r => {
            const assignedRegister = vr.meterTotalAssignment.assignedRegisters.some(ar => ar.id === r.id);

            if (!assignedRegister) {
              return r;
            }

          });

        vr = {...vr, bulkRegisters: [...sameTypeRegisters.map(r => ({name: r.name, factor: 1, id: r.id}))]};

        return vr;
      });

      const form = {
        ...formState.value,
        virtualRegisters: mappedVirtualRegisters,
        registers: [...formState.value.registers, register]
      };

      return of(new SetValueAction(equipmentFormStore.FORM_ID, form));
    })
  ));
  // Add Virtual register
  addVirtualRegister = createEffect(() => this.actions$.pipe(
    ofType(equipmentFormActions.ADD_VIRTUAL_REGISTER),
    withLatestFrom(this.store$.pipe(select(fromEquipment.getEquipmentFormFormState)),
      this.store$.pipe(select(fromEquipment.getEquipmentEquipmentTemplateRegistersDict)),
      (action: equipmentFormActions.AddVirtualRegister, equipmentStateForm, equipmentRegistersDict) => {
        return {
          vRegister: action.payload,
          formState: equipmentStateForm,
          equipmentRegistersDict
        };
      }),
    switchMap(({formState, vRegister, equipmentRegistersDict}) => {
      const {value} = formState;
      const registers = [...value.registers].map(r => {
        r.unitOfMeasurement = equipmentRegistersDict[r.id].unitOfMeasurement;
        return r;
      }).filter(r => r.unitOfMeasurement === vRegister.unitOfMeasurement);

      switch (vRegister.type) {
        case VirtualRegisterType.MeterTotal: {
          const assignedMeters = registers.map(r => ({name: r.name, factor: 1, id: r.id}));

          vRegister.meterTotalAssignment = {
            ...vRegister.meterTotalAssignment,
            assignedRegisters: assignedMeters
          };

          break;
        }
      }

      const form = {
        ...value,
        virtualRegisters: [...value.virtualRegisters, vRegister]
      };

      return of(new SetValueAction(equipmentFormStore.FORM_ID, form));
    })
  ));
  // Add register To Bulk
  AddAssignedRegisterToBulk = createEffect(() => this.actions$.pipe(
    ofType(equipmentFormActions.ADD_ASSIGNED_REGISTER_TO_VR),
    withLatestFrom(this.store$.pipe(select(fromEquipment.getEquipmentFormFormState)),
      (action: equipmentFormActions.AddAssignedRegisterToVR, equipmentStateForm) => {
        return {
          type: action.payload.type,
          vrId: action.payload.vrId,
          register: action.payload.register,
          formState: equipmentStateForm,
        };
      }),
    switchMap(({formState, type, register, vrId}) => {

      const virtualRegisters = [...formState.value.virtualRegisters];
      const virtualRegisterId = virtualRegisters.findIndex(vr => vr.id === vrId);

      switch (type) {
        case VirtualRegisterType.MeterTotal: {

          const bulkRegisters = virtualRegisters[virtualRegisterId].bulkRegisters.filter(b => b.id !== register.id);
          const meterTotalAssignment = {...virtualRegisters[virtualRegisterId].meterTotalAssignment};

          virtualRegisters[virtualRegisterId] = {
            ...virtualRegisters[virtualRegisterId],
            isExpanded: true,
            bulkRegisters,
            meterTotalAssignment: {
              ...meterTotalAssignment,
              assignedRegisters: [...meterTotalAssignment.assignedRegisters, register]
            }
          };
          break;
        }
      }

      const form = {
        ...formState.value,
        virtualRegisters
      };

      return of(new SetValueAction(equipmentFormStore.FORM_ID, form));
    })
  ));
  // Remove register
  removeRegister = createEffect((): Observable<any> => this.actions$.pipe(
    ofType(equipmentFormActions.REMOVE_REGISTER, equipmentFormActions.REMOVE_REGISTER_WITH_TOTAL_ASSIGNMENT),
    withLatestFrom(
      this.store$.select(fromEquipment.getEquipmentFormFormState),
      this.store$.select(commonData.getSelectedVersionId),
      (action: any, equipmentStateForm, versionId) => {
        return {
          action,
          versionId,
          registerId: action.payload,
          formState: equipmentStateForm
        };
      }),
    switchMap(({action, versionId, registerId, formState}) => {

      // Remove register from bulk
      // Remove assigned register from VR
      // Check if target register is set in Signal Meter

      let form = {...formState.value};
      const registers = [...form.registers];
      const popupMessage = new ConfirmationPopupMessage();
      popupMessage.title = 'Remove failed';

      let virtualRegisters = [...form.virtualRegisters];
      const registerAssignees = virtualRegisters.filter(r => r.meterTotalAssignment
        && r.meterTotalAssignment.assignedRegisters.some(ar => ar.id === registerId));

      if (registerAssignees.length > 0 && action.type !== equipmentFormActions.REMOVE_REGISTER_WITH_TOTAL_ASSIGNMENT) {
        popupMessage.message = 'Register is assigned for total registers:';
        popupMessage.values = {['']: registerAssignees.map(r => r.name)};
        popupMessage.actions = [ConfimationPopupActions.confirm, ConfimationPopupActions.cancel];
        this.showRemoveInvalidPopup(popupMessage,
          () => this.store$.dispatch(new equipmentFormActions.RemoveRegisterWithTotalAssignment(registerId)));
        return of();
      } else {
        virtualRegisters = virtualRegisters.map(vr => {
          if (vr.type === VirtualRegisterType.MeterTotal) {
            return {
              ...vr,
              meterTotalAssignment: {
                ...vr.meterTotalAssignment,
                assignedRegisters: vr.meterTotalAssignment.assignedRegisters.filter(b => b.id !== registerId)
              },
              bulkRegisters: vr.bulkRegisters.filter(b => b.id !== registerId)
            };
          }
          return {...vr};
        });
      }

      const containsTarget = virtualRegisters.find(vr => isTargetMeterExist(vr, registerId));

      if (containsTarget) {
        popupMessage.message = 'Register is assigned as target for virtual register \'' + containsTarget.name + '\'';
        popupMessage.actions = [ConfimationPopupActions.cancel];
        this.showRemoveInvalidPopup(popupMessage);
        return of();
      }

      return this.equipmentService.canRemoveRegister(versionId, form.id, registerId)
        .pipe(mergeMap(response => {
          if (response.hasError) {
            this.showRemoveInvalidPopup(response);
            return of();
          }

          form = {
            ...form,
            registers: registers.filter(r => r.id !== registerId),
            virtualRegisters: virtualRegisters
          };
          return of(new SetValueAction(equipmentFormStore.FORM_ID, form));
        }));
    })
  ));
  // Start edit equipment
  editEquipment: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentFormActions.EDIT_EQUIPMENT),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      this.store$.pipe(select(commonData.getRegisters)),
      this.store$.pipe(select(commonData.getActiveBuildingPeriod)),
      this.store$.pipe(select(fromEquipment.getEquipmentFormFormState)),
      (action: any, buildingId, versionId, commonRegisters: RegisterViewModel[], activeBuildingPeriod: BuildingPeriodViewModel, equipmentFormFormState) => {
        return {
          action,
          meterId: action.payload,
          buildingId: buildingId,
          versionId: versionId,
          commonRegisters,
          activeBuildingPeriod,
          equipmentFormFormState
        };
      }),
    switchMap(({
                 action,
                 meterId,
                 buildingId,
                 versionId,
                 commonRegisters,
                 activeBuildingPeriod,
                 equipmentFormFormState
               }) => {
      return this.equipmentService.getMeter(buildingId, meterId, versionId).pipe(
        mergeMap(r => {
          const registers = (r.equipment.registers ? r.equipment.registers : []).map(register => {
            const result = {...register};
            result.date = convertDateToNgbDate(new Date());
            return result;
          });
          this.localStorageService.set('EquipmentDetailRegisters', registers);

          const equipmentRegisters = [...registers];

          const sharedEquipmentRegisters = equipmentRegisters.map(r => {
            const register = commonRegisters.find(cr => cr.id === r.id);

            return {...register, unitOfMeasurement: register.unitOfMeasurement};
          });

          r.virtualRegisters = r.virtualRegisters.map(vr => {
            let bulkRegisters = [];

            const sameTypeRegisters = [...sharedEquipmentRegisters].filter(sr => sr.unitOfMeasurement === vr.unitOfMeasurement);

            switch (vr.type) {
              case VirtualRegisterType.MeterTotal:
                bulkRegisters = sameTypeRegisters.filter(sr => {
                  if (!vr.meterTotalAssignment.assignedRegisters.length) {
                    return sr;
                  }

                  const assignedRegister = vr.meterTotalAssignment.assignedRegisters.some(ar => ar.id === sr.id);

                  if (!assignedRegister) {
                    return sr;
                  }
                }).map(br => ({name: br.unit, factor: 1, id: br.id}));
                break;
            }

            return {
              ...vr,
              bulkRegisters,
              isExpanded: false,
            };
          });

          const model = Object.assign({}, {
            id: r.id,
            parentMeters: r.parentMeters,
            serialNumber: r.serialNumber,
            manufactureDate: r.manufactureDate,
            equipmentModel: r.equipment.equipmentModel,
            supplyType: r.equipment.supplyType,
            photos: r.equipment.photos ? r.equipment.photos : [],
            logoUrl: r.logoUrl,
            registers: registers,
            virtualRegisters: r.virtualRegisters,
            attributes: r.equipment.attributes ? r.equipment.attributes : [],
            unitIds: box([...(r.shopIds || []), ...(r.commonAreaIds || [])]),
            equipmentGroup: r.equipment.equipmentGroup,
            isDisplayOBISCode: r.equipment.isDisplayOBISCode,

            locationId: r.location.location ? r.location.location.id : null,
            locationName: r.location.location ? r.location.location.name : null,
            supplyId: r.location.supplyDetail ? r.location.supplyDetail.id : null,
            supplyName: r.location.supplyDetail ? r.location.supplyDetail.name : null,
            locationType: r.location.supplyDetail ? r.location.supplyDetail.locationType : null,
            description: r.location.description,
            isVerification: r.location.isVerification,
            testingDate: r.location.testingDate,
            testingNote: r.location.testingNote,
            technicianId: r.location.technician ? r.location.technician.id : null,
            technicianName: r.location.technician ? r.location.technician.fullName : null,

            isDummy: r.isDummy,
            isFaulty: r.isFaulty,
            reasonOfFaulty: r.reasonOfFaulty,

            isSmartModel: r.isSmartModel,
            breakerState: r.breakerState !== BreakerState.Off,
            supplyToLocationId: r.location.supplyDetail ? r.location.supplyDetail.supplyToLocationId : null,
            amrImportDate: r.amrImportDate ? r.amrImportDate : activeBuildingPeriod.startDate,
            isConnectedToAmr: r.isConnectedToAmr
          });

          return [
            new SetValueAction(equipmentFormStore.FORM_ID, model),
            new equipmentFormActions.ToggleTechnologyAttribute(),
            new equipmentFormActions.GetLocationsRequest(),
            new equipmentFormActions.GetShopsRequest(),
            new equipmentFormActions.GetCommonAreasRequest(),
            new equipmentFormActions.GetSuppliesRequest(),
            new equipmentFormActions.GetEquipmentTemplateRequest(r.equipment.id),
            new equipmentFormActions.GetEquipmentTemplatesRequest(r.equipment.supplyType),
            new equipmentFormActions.GetMetersRequest(),
          ];
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );

    })
  ));
  toggleTechnology = createEffect(() => this.actions$.pipe(
    ofType(equipmentFormActions.TOGGLE_TECHNOLOGY_ATTRIBUTE),
    withLatestFrom(
      this.store$.pipe(select(fromEquipment.getEquipmentFormFormState)),
      (_, formState) => {
        return {
          formState
        };
      }),
    switchMap(({formState}) => {
      return of(toggleTechnologyAction(formState));
    })
  ));
  updateCommonData = createEffect(() => this.actions$.pipe(
    ofType(equipmentFormActions.UPDATE_EQUIPMENT_COMMON_DATA),
    switchMap(() => {
      return this.equipmentDataService.getAllRegisters(null)
        .pipe(map(registers => new commonDataActions.SetEquipmentRegisters(registers)));
    })
  ));
  // Save equipment
  saveEquipment = createEffect(() => this.actions$.pipe(
    ofType(equipmentFormActions.SEND_REQUEST_EQUIPMENT),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(fromEquipment.getEquipmentEquipmentTemplate)),
      this.store$.pipe(select(fromEquipment.getEquipmentFormFormState)),
      this.store$.pipe(select(fromEquipment.getEquipmentUnitOptions)),
      this.store$.pipe(select(commonData.getIsComplete)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      (action: any, buildingId, equipmentTemplate, formState, unitOptions, isComplete, versionId) =>
        ({action, formState, buildingId, equipmentTemplate, unitOptions, isComplete, versionId})),
    switchMap(({action, formState, buildingId, equipmentTemplate, unitOptions, isComplete, versionId}) => {
      if (!formState.isValid) {
        return of({status: false, payload: null});
      }

      const form = formState.value;
      let {comment, date, actionType} = action.payload;

      actionType = isComplete ? actionType : VersionActionType.Init;

      const model = Object.assign(new MeterWriteViewModel(), {
        id: form.id,
        buildingId,
        equipmentTemplateId: equipmentTemplate ? equipmentTemplate.id : '',
        parentMeters: form.parentMeters,
        serialNumber: form.serialNumber,
        manufactureDate: form.manufactureDate,
        equipmentGroup: form.equipmentGroup,
        equipmentModel: form.equipmentModel,
        supplyType: form.supplyType,
        virtualRegisters: form.virtualRegisters.map(vr => ({
          ...vr,
          sequenceNumber: form.virtualRegisters.indexOf(vr)
        })),
        registers: form.registers.map(r => {
          const rDate = r.date.value || r.date;
          return {
            ...r,
            date: convertNgbDateToDate(rDate),
            sequenceNumber: form.registers.indexOf(r)
          };
        }),
        attributes: form.attributes,
        location: {
          location: form.locationId ? {
            id: form.locationId,
            name: form.locationName
          } : null,
          supplyDetail: form.supplyId ? {
            id: form.supplyId,
            name: form.supplyName,
            locationType: form.locationType,
            supplyToLocationId: form.supplyToLocationId
          } : null,
          description: form.description,
          isVerification: form.isVerification,
          testingDate: form.testingDate,
          testingNote: form.testingNote,
          technician: form.technicianId ? {
            id: form.technicianId,
            fullName: form.technicianName
          } : null
        },

        isDisplayOBISCode: form.isDisplayOBISCode,
        isDummy: form.isDummy,
        isFaulty: form.isFaulty,
        reasonOfFaulty: form.reasonOfFaulty,

        shopIds: unbox(form.unitIds).filter(id => unitOptions.find(o => o.unitType === UnitType.Shop && o.id == id)),
        commonAreaIds: unbox(form.unitIds).filter(id => unitOptions.find(o => o.unitType === UnitType.CommonArea && o.id == id)),
        actualPhoto: form.actualPhoto,
        logoUrl: form.logoUrl,
        isSmartModel: form.isSmartModel,
        breakerState: isBreaker(form) ? (form.breakerState ? BreakerState.On : BreakerState.Off) : null,

        amrImportDate: form.amrImportDate
      });

      const version: VersionViewModel<MeterWriteViewModel> = new VersionViewModel(model, comment,
        actionType, date, versionId);
      
      return this.equipmentService.updateMeter(buildingId, version).pipe(
        map(r => {
          return {status: true, payload: r};
        }),
        catchError(r => {
          return of({status: false, payload: null});
        })
      );

    }),
    switchMap((result: any) => {
      if (result.status) {
        const versionDay = result.payload.current.versionDate;
        this.versionUpdateService.showVersionUpdateResults(result.payload.next);
        return [
          new equipmentFormActions.ToggleTechnologyAttribute(),
          new commonDataActions.UpdateUrlVersionAction(versionDay),
          new commonDataActions.GetHistoryWithVersionId(result.payload.current.id),
          new equipmentFormActions.UpdateEquipmentCommonData(),
          new equipmentFormActions.SendRequestEquipmentComplete()
        ];
      }
      return of({type: 'DUMMY'});
    })
  ));
  // Clone equipment
  cloneEquipment: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentActions.CLONE_EQUIPMENT),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      (action: any, buildingId, versionId) => {
        return {
          equipmentId: action.payload,
          buildingId: buildingId,
          versionId: versionId
        };
      }),
    switchMap(({equipmentId, buildingId, versionId}) => {

      return this.locationEquipmentService.cloneEquipment(buildingId, equipmentId, versionId).pipe(
        map(r => {
          return new commonDataActions.GetHistoryWithVersionId(r.id);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );

    })
  ));
  // Get equipment templates
  getEquipmentTemplates: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentFormActions.GET_EQUIPMENT_TEMPLATES_REQUEST),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      (action: any, buildingId) => {
        return {
          buildingId: buildingId,
          supplyType: action.payload
        };
      }),
    switchMap(({buildingId, supplyType}) => {
      return this.equipmentService.getEquipments(buildingId).pipe(
        map(r => {
          return new equipmentFormActions.GetEquipmentTemplatesRequestComplete(r.filter(t => t.supplyType === supplyType));
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Get list of equipment templates
  getMeters = createEffect(() => this.actions$.pipe(
    ofType(equipmentFormActions.GET_METERS_REQUEST),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      (_, buildingId, versionId) => {
        return {
          buildingId: buildingId,
          buildingVersionId: versionId
        };
      }),
    switchMap(({buildingId, buildingVersionId}) => {

      return this.equipmentService.getMeters(buildingId, buildingVersionId).pipe(
        map((items: any[]) => {
          return new equipmentFormActions.GetMetersRequestComplete(items);
        }),
        catchError(() => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  updateEquipment: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentActions.REQUEST_EQUIPMENT_LIST_COMPLETE),
    withLatestFrom(
      this.store$.select(fromEquipment.getEquipmentState),
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      (_, equipmentState, buildingId, versionId) => {
        return {
          state: equipmentState,
          versionId: versionId,
          buildingId: buildingId
        };
      }),
    switchMap(({state, buildingId, versionId}) => {

      return this.equipmentService.getMeters(buildingId, versionId).pipe(
        map((meters: MeterDetailViewModel[]) => {
          state.equipments = state.equipments.map(eq => ({
            ...eq,
            registers: meters.find(r => r.id === eq.id).registers
          }));

          return new equipmentActions.UpdateEquipments(state.equipments);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Get equipments
  getEquipmentRequest: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentActions.REQUEST_EQUIPMENT_LIST),
    withLatestFrom(
      this.store$.select(fromEquipment.getEquipmentState),
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      (action: equipmentActions.RequestEquipmentList, equipmentState, buildingId, versionId) => {
        return {
          state: equipmentState,
          payload: action.payload,
          versionId: versionId,
          buildingId: buildingId
        };
      }),
    switchMap(({state, buildingId, versionId, payload}) => {
      const filterModel: PagingOptions<MeterListFilterParameters> = {
        requestParameters: {
          buildingId,
          versionId,
          nodeId: state.selectedNodeId,
          locationId: state.selectedLocationId,
          unitId: state.selectedUnitId,
          supplyType: state.supplyTypeFilter,
          searchKey: state.searchKey,
          order: state.order,
          unitOfMeasurement: 0,
          onlyAMRSource: false,
          excludeMeterIds: [],
        },
        skip: payload.skip,
        take: payload.take
      };

      if (payload) {
        filterModel.requestParameters.unitOfMeasurement = payload.requestParameters.unitOfMeasurement;
        //filterModel.requestParameters.searchKey = payload.requestParameters.searchKey;
        filterModel.requestParameters.onlyAMRSource = payload.requestParameters.onlyAMRSource;
        filterModel.requestParameters.excludeMeterIds = payload.requestParameters.excludeMeterIds;
        filterModel.requestParameters.filter = payload.requestParameters.filter;
      }

      const objParams = convertAnyToParams(filterModel);

      return this.equipmentService.getMeterList(buildingId, objParams).pipe(
        switchMap(r => {
          let result = {
            equipments: r.items.map(item => {
              return {
                ...item,
                photoUrl: `/api/v1/buildings/${buildingId}/meters/${item.id}/${MeterPhotoType.ActualPhoto}/image`
              };
            }),
            total: r.total,
            nodes: {},
            units: {},
            locations: {},
            supplyTypes: {}
          };

          result = {
            ...result,
            ...this.mapEquipmentModel(r, result)
          };

          return [
            new equipmentFormActions.GetCommonAreasRequest(),
            new equipmentFormActions.GetShopsRequest(),
            new equipmentActions.RequestEquipmentListComplete(result)
          ];
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Update search key
  updateSearchKey: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentActions.UPDATE_SEARCH_KEY),
    withLatestFrom((action: any) => {
      return {
        searchKey: action.payload
      };
    }),
    debounceTime(700),
    map(({searchKey}) => {
      const filter: PagingOptions<MeterListFilterParameters> = {
        requestParameters: new MeterListFilterParameters(),
        skip: 0,
        take: 0
      };

      filter.requestParameters.searchKey = searchKey;

      return new equipmentActions.RequestEquipmentList(filter);
    })
  ));
  // Update order, supply type, location, unit, node
  updateOrderSupplyTypeLocationUnitNode: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentActions.UPDATE_ORDER, equipmentActions.UPDATE_LOCATION_FILTER, equipmentActions.UPDATE_SUPPLY_TYPE_FILTER,
      equipmentActions.UPDATE_NODE_FILTER, equipmentActions.UPDATE_UNIT_FILTER),
    withLatestFrom((action: any) => {
      return {
        order: action.payload
      };
    }),
    map((action) => {
      return new equipmentActions.RequestEquipmentList();
    })
  ));
  // connect to AMR system SCADA
  connectToAmrSystem = createEffect(() => this.actions$.pipe(
    ofType(CONNECT_TO_AMR_REQUEST),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      this.store$.pipe(select(fromEquipment.getEquipmentFormFormState)),

      (action: any, buildingId, versionId, equipmentFormStore) => {
        return {
          buildingId,
          versionId,
          meterId: action.payload,
          importPeriodStartDate: equipmentFormStore.value.amrImportDate
        };
      }),
    switchMap(({meterId, buildingId, versionId, importPeriodStartDate}) => {
      return this.equipmentService.connectToAmrSystem(buildingId, meterId, versionId, importPeriodStartDate).pipe(
        map(r => {

          return new ConnectToAmrSystemRequestComplete();
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // get readings
  getReadings = createEffect(() => this.actions$.pipe(
    ofType(GET_READINGS_FROM_AMR_REQUEST),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),

      (action: any, buildingId) => {
        return {
          buildingId,
          meterId: action.payload
        };
      }),
    switchMap(({buildingId, meterId}) => {
      return this.equipmentService.getReadings(buildingId, meterId).pipe(
        map(r => {
          return new GetReadingsFromAmrSystemRequestComplete();
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // toggle breaker
  toggleBreaker = createEffect(() => this.actions$.pipe(
    ofType(TOGGLE_BREAKER_REQUEST),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      this.store$.pipe(select(fromEquipment.getEquipmentFormFormState)),
      (action: any, buildingId, versionId, form) => {
        return {
          meterId: action.payload,
          buildingId: buildingId,
          versionId: versionId,
          form: form
        };
      }),
    switchMap(({meterId, buildingId, versionId, form}) => {
      const breakerState = form.value.breakerState;
      return this.equipmentService.getSwitchBreaker(buildingId, meterId, versionId, breakerState ? BreakerState.Off : BreakerState.On).pipe(
        map(r => {
          return new ToggleBreakerRequestComplete(!breakerState);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  getBranchAmrAccounts: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(equipmentActions.REQUEST_BRANCH_AMR_ACCOUNTS),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      (action: any, buildingId) => {
        return {
          branchId: action.payload,
          buildingId
        };
      }),
    switchMap(({branchId, buildingId}) => {
      return this.branchService.getAutomaticMeterReadingAccount(branchId).pipe(
        map(accounts => {
          const isBuildingWithAmrAccount = accounts.some(a => a.buildingIds.some(b => b === buildingId))
          return new equipmentActions.IsBuildingWithAmrAccount(isBuildingWithAmrAccount);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      )
    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<fromEquipment.State>,
    private equipmentDataService: EquipmentService,
    private equipmentService: MeterService,
    private locationEquipmentService: LocationEquipmentService,
    private buildingEquipmentTemplateService: BuildingEquipmentTemplateService,
    private versionUpdateService: ApplyResultService,
    private modalService: NgbModal,
    private branchService: BranchSettingsService,
    private localStorageService: LocalStorageService
  ) {
  }

  private mapEquipmentModel(r: PagingViewModel<MeterViewModel>, result) {
    r.items.forEach(m => {
      result.locations[m.location.id] = {
        id: m.location.id,
        name: m.location.name
      };

      result.supplyTypes[m.supplyType] = {
        id: m.supplyType,
        name: SupplyType[m.supplyType]
      };

      m.nodes.forEach(n => {
        result.nodes[n.id] = {
          id: n.id,
          name: n.name
        };
      });

      m.shops.forEach(s => {
        result.units[s.id] = {
          id: s.id,
          name: s.name
        };
      });

      m.commonAreas.forEach(c => {
        result.units[c.id] = {
          id: c.id,
          name: c.name
        };
      });
    });

    return result;
  }

  private showRemoveInvalidPopup(popupMessage: ConfirmationPopupMessage,
                                 onConfirm: () => any = () => {
                                 }, onCancel: () => any = () => {
    }) {
    const modalRef = this.modalService.open(RemoveDialogComponent, {
      backdrop: 'static',
      size: 'sm'
    });

    modalRef.componentInstance.validationMessage = popupMessage;
    return modalRef.result.then(onConfirm, onCancel);
  }
}
