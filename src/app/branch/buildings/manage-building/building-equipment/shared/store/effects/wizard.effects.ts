import {Injectable} from '@angular/core';
import {FieldType, VersionActionType, VersionViewModel} from '@models';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {StringExtension} from 'app/shared/helper/string-extension';
import {MarkAsSubmittedAction, ResetAction, SetValueAction} from 'ngrx-forms';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import * as commonDataActions from '../../../../shared/store/actions/common-data.action';
import * as commonData from '../../../../shared/store/selectors/common-data.selectors';

import {MeterService} from '../../meter.service';
import {MeterWriteViewModel} from '../../models';
import * as equipmentStepActions from '../actions/equipment-step.actions';
import * as equipmentActions from '../actions/equipment.actions';
import * as locationEquipmentActions from '../actions/location-equipment.action';
import * as locationStepActions from '../actions/location-step.actions';
import * as shopStepActions from '../actions/shop-step.actions';

import * as wizardAction from '../actions/wizard.actions';

import * as fromEquipment from '../reducers';
import * as wizardEquipmentStepState from '../reducers/equipment-step.store';
import * as wizardLocationStepState from '../reducers/location-step.store';
import * as wizardShopStepState from '../reducers/shop-step.store';

import * as fromWizard from '../reducers/wizard.store';
import {convertNgbDateToDate} from '@app/shared/helper/date-extension';

@Injectable()
export class WizardEffects {

  readonly FIRST_STEP: number = 0;
  readonly SECOND_STEP: number = 1;
  readonly THIRD_STEP: number = 2;
  readonly FOURTH_STEP: number = 3;
  readonly CLOSE_WIZARD: number = 4;
  // Reset wizard
  resetWizard = createEffect(() => this.actions$.pipe(
    ofType(wizardAction.RESET_WIZARD),
    withLatestFrom(this.store$.pipe(select(fromEquipment.getWizardStepStates)), (_, state: {
      wizardState: fromWizard.State,
      locationStep: wizardEquipmentStepState.State,
      equipmentStep: wizardLocationStepState.State
    }) => {
      return {
        state: state
      };
    }),
    switchMap(() => {

      const resetFirstStepValueAction = new SetValueAction(wizardEquipmentStepState.FORM_ID, wizardEquipmentStepState.INIT_DEFAULT_STATE);
      const resetSecondStepValueAction = new SetValueAction(wizardLocationStepState.FORM_ID, wizardLocationStepState.INIT_DEFAULT_STATE);
      const resetEquipmentStep = new ResetAction(wizardEquipmentStepState.FORM_ID);
      const resetLocationdStep = new ResetAction(wizardLocationStepState.FORM_ID);
      const resetShopStep = new shopStepActions.ResetShopData();
      const resetEquipmentState = new equipmentStepActions.ResetEquipmentStep();

      return [resetFirstStepValueAction, resetEquipmentStep, resetSecondStepValueAction,
        resetLocationdStep, resetShopStep, resetEquipmentState];
    })
  ));
  // Try navigate to next step
  tryNavigateNextStep = createEffect((): Observable<any> => this.actions$.pipe(
    ofType(wizardAction.TRY_NEXT_STEP),
    withLatestFrom(
      this.store$.pipe(select(fromEquipment.getIsLocationWizard)),
      this.store$.pipe(select(fromEquipment.getWizardStepStates)),
      this.store$.pipe(select(fromEquipment.getRegisterFiles)),
      this.store$.pipe(select(commonData.getSelectedHistoryLog)),
      this.store$.pipe(select(commonData.getIsComplete)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      (action: any, isLocationWizard, state: {
        buildingId: string,
        wizardState: fromWizard.State,
        equipmentStep: wizardEquipmentStepState.State,
        locationStep: wizardLocationStepState.State,
        shopStep: wizardShopStepState.State
      }, files, selectedVersion, isComplete, versionId) => {
        return {
          state: state,
          isLocationWizard: isLocationWizard,
          payload: action.payload,
          files: files,
          selectedVersion: selectedVersion,
          isComplete,
          versionId
        };
      }),
    switchMap((params) => {

      const {isLocationWizard, state, payload, files, selectedVersion, isComplete, versionId} = params;

      let actions = [];
      const actionType = isComplete ? state.wizardState.actionType : VersionActionType.Init;

      let date = null;
      if (actionType === VersionActionType.Insert) {
        date = state.wizardState.versionDate;
      } else if (selectedVersion) {
        date = selectedVersion.startDate;
      }

      const model: MeterWriteViewModel = this.compositMeterModel(state, files);
      const version: VersionViewModel<MeterWriteViewModel> = new VersionViewModel(model, state.wizardState.comment,
        actionType, date, versionId);

      const updateMeter = (isReloadData = false) => {
        return this.equipmentService.updateMeter(state.buildingId, version).pipe(map((r) => {
          const goNextStepAction = new wizardAction.GoToStep(payload);
          const updateHistory = new commonDataActions.GetHistoryWithVersionId(r.current.id);
          const updateUrl = new commonDataActions.UpdateUrlVersionAction(r.current.versionDate);
          const updatedActions = [...actions, updateUrl, updateHistory, goNextStepAction];
          if (isReloadData) {
            updatedActions.push(new locationEquipmentActions.ReloadLocationData({versionId: r.current.id}));
          }

          return updatedActions;
        }), catchError(() => {
          return [...actions, {type: 'DUMMY'}];
        }));
      };

      const createMeter = () => {
        return this.equipmentService.createMeter(state.buildingId, version).pipe(map(r => {
          const updateMeterId = new wizardAction.UpdateMeterId(r.entity);
          const goNextStepAction = new wizardAction.GoToStep(payload);
          const updateHistory = new commonDataActions.GetHistoryWithVersionId(r.current.id);
          const updateUrl = new commonDataActions.UpdateUrlVersionAction(r.current.versionDate);
          return [...actions, updateUrl, updateHistory, updateMeterId, goNextStepAction];
        }), catchError(() => {
          return [...actions, {type: 'DUMMY'}];
        }));
      };

      switch (payload) {
        case this.SECOND_STEP: {
          const submitAction = new MarkAsSubmittedAction(wizardEquipmentStepState.FORM_ID);

          actions.push(submitAction);
          if (state.equipmentStep.formState.isValid) {

            const getLocations = new locationStepActions.GetLocationsRequest();
            const getSupplies = new locationStepActions.GetSuppliesRequest();
            const getTechnicians = new locationStepActions.GetTechniciansRequest();

            actions = [...actions, getSupplies, getTechnicians, getLocations];

            if (StringExtension.isGuid(model.id)) {
              return updateMeter();
            } else {
              return createMeter();
            }
          }
        }
          break;

        case this.THIRD_STEP: {
          actions.push(new shopStepActions.GetShopsRequest());
          actions.push(new shopStepActions.GetCommonAreasRequest());
          if (state.locationStep.formState.isValid) {
            return updateMeter();
          }
        }
          break;

        case this.FOURTH_STEP: {
          const closeWizard = new wizardAction.ToggleWizard();

          actions.push(closeWizard);

          let needReloadData = false;

          if (!isLocationWizard) {
            actions.push(new equipmentActions.RequestEquipmentList());
          } else {
            needReloadData = true;
          }

          if (state.locationStep.formState.isValid) {
            return updateMeter(needReloadData);
          }

          break;
        }

        case this.CLOSE_WIZARD: {
          const closeWizard = new wizardAction.ToggleWizard();
          actions.push(closeWizard);
          return updateMeter();
        }

        default:
          throw new Error('Unknow step');
      }

      return of(actions);
    }),
    switchMap((actions) => {

      return actions;
    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<fromEquipment.State>,
    private equipmentService: MeterService
  ) {
  }

  compositMeterModel(state: {
    buildingId: string,
    wizardState: fromWizard.State,
    equipmentStep: wizardEquipmentStepState.State,
    locationStep: wizardLocationStepState.State,
    shopStep: wizardShopStepState.State
  }, files: {}): MeterWriteViewModel {
    const equipmentStepValue = state.equipmentStep.formState.value;
    const locationStepValue = state.locationStep.formState.value;
    const shopStepValue = state.shopStep;

    return {
      ...new MeterWriteViewModel(),
      id: state.wizardState.meterId,
      buildingId: state.buildingId,
      parentMeters: equipmentStepValue.parentMeters,
      serialNumber: equipmentStepValue.serialNumber,
      manufactureDate: equipmentStepValue.manufactureDate,
      supplyType: equipmentStepValue.supplyType,
      location: {
        location: locationStepValue.id ? {
          id: locationStepValue.id,
          name: locationStepValue.name
        } : null,
        supplyDetail: locationStepValue ? {
          id: locationStepValue.supplyId,
          name: locationStepValue.supplyName,
          locationType: locationStepValue.locationType,
          supplyToLocationId: locationStepValue.supplyToLocationId
        } : null,
        description: locationStepValue.description,
        isVerification: locationStepValue.isVerification,
        testingDate: locationStepValue.testingDate,
        testingNote: locationStepValue.testingNote,
        technician: locationStepValue.technicianId ? {
          id: locationStepValue.technicianId,
          fullName: locationStepValue.technicianName
        } : null
      },
      registers: equipmentStepValue.registers.map(r => {
        const register = {...r};
        const date = register.date.value || register.date;
        register.date = convertNgbDateToDate(date);
        const registerFile = files[register.id];
        if (registerFile) {
          register.photo = files[register.id].file;
        }
        register.sequenceNumber = equipmentStepValue.registers.indexOf(r);
        return register;
      }),
      equipmentTemplateId: equipmentStepValue.id,
      equipmentGroup: equipmentStepValue.equipmentGroup,
      isDisplayOBISCode: equipmentStepValue.isDisplayOBISCode,
      equipmentModel: equipmentStepValue.equipmentModel,
      attributes: equipmentStepValue.attributes && equipmentStepValue.attributes.map(a => ({
        attribute: a.attribute,
        value: a.value,
        numberValue: a.attribute.fieldType === FieldType.Number ? a.numberValue : null,
        photoUrl: a.photoUrl,
        photo: a.photo
      })),
      shopIds: shopStepValue.selectedIds.filter(id => shopStepValue.shops.find(u => u.id === id)),
      commonAreaIds: shopStepValue.selectedIds.filter(id => shopStepValue.commonAreas.find(u => u.id === id)),
      isDummy: equipmentStepValue.isDummy,
      isFaulty: equipmentStepValue.isFaulty,
      reasonOfFaulty: equipmentStepValue.reasonOfFaulty,
      actualPhoto: equipmentStepValue.actualPhoto,
      logoUrl: state.equipmentStep.formState.controls.equipmentPhotoUrl.value
    };
  }
}
