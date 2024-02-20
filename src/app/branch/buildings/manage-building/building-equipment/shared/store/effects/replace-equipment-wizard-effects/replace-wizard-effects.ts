import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {of, Observable} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {box, MarkAsSubmittedAction, ResetAction, SetValueAction} from 'ngrx-forms';

import * as commonDataActions from '../../../../../shared/store/actions/common-data.action';
import * as replaceWizardAction from '../../actions/replace-equipment-wizard-actions/replace-wizard.actions';
import * as replaceEquipmentActions
  from '../../actions/replace-equipment-wizard-actions/replace-equipment-step.actions';
import * as replaceNodeTariffActions
  from '../../actions/replace-equipment-wizard-actions/replace-node-tariff-step.actions';

import * as replaceWizardStore from '../../reducers/replace-equipment-wizard-reducers/replace-wizard.store';
import * as addClosingReadingsStore
  from '../../reducers/replace-equipment-wizard-reducers/add-closing-readings-step.store';
import * as replaceEquipmentStore from '../../reducers/replace-equipment-wizard-reducers/replace-equipment-step.store';
import * as replaceNodeTariffStore
  from '../../reducers/replace-equipment-wizard-reducers/replace-node-tariff-step.store';
import * as commonData from '../../../../../shared/store/selectors/common-data.selectors';

import * as replaceWizardSelector from '../../selectors/replace-wizard-selectors/replace-wizard.selector';
import * as addClosingReadingsSelector
  from '../../selectors/replace-wizard-selectors/add-closing-readings-step.selector';
import * as replaceEquipmentSelector from '../../selectors/replace-wizard-selectors/replace-equipment-step.selector';

import {MeterService} from '../../../meter.service';
import {ReplaceMeterViewModel} from '../../../models';
import {ReadingSource, VersionActionType, VersionViewModel} from '@models';
import {ReadingViewModel} from 'app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';

@Injectable()
export class ReplaceWizardEffects {

  readonly FIRST_STEP: number = 0;
  readonly SECOND_STEP: number = 1;
  readonly THIRD_STEP: number = 2;
  readonly CLOSE_WIZARD: number = 3;
  // Reset replace wizard
  resetReplaceWizard = createEffect(() => this.actions$.pipe(
    ofType(replaceWizardAction.RESET_WIZARD),
    switchMap(() => [
        new SetValueAction(addClosingReadingsStore.FORM_ID, addClosingReadingsStore.INIT_DEFAULT_STATE),
        new ResetAction(addClosingReadingsStore.FORM_ID),
        new SetValueAction(replaceEquipmentStore.FORM_ID, replaceEquipmentStore.INIT_DEFAULT_STATE),
        new ResetAction(replaceEquipmentStore.FORM_ID),
        new replaceNodeTariffActions.ResetState()
      ]
    )
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<any>,
    private meterService: MeterService
  ) {
  }

  compositMeterModel(state: {
                       wizardState: replaceWizardStore.State,
                       addClosingReadingsState: addClosingReadingsStore.State,
                       replaceEquipmentState: replaceEquipmentStore.State,
                       replaceNodeTariffState: replaceNodeTariffStore.State
                     },
                     addClosingReadingsFiles: {},
                     replaceEquipmentRegisterFiles: {}): ReplaceMeterViewModel {
    const meterId = state.wizardState.meterId;
    const addClosingReadingsStepValue = state.addClosingReadingsState.formState.value;
    const location = state.replaceEquipmentState.location;
    const shopIds = state.replaceEquipmentState.shopIds;
    const actualPhoto = state.replaceEquipmentState.actualPhoto;
    const commonAreaIds = state.replaceEquipmentState.commonAreaIds;
    const replaceEquipmentStepValue = state.replaceEquipmentState.formState.value;
    const nodes = state.replaceNodeTariffState.nodes;

    return <ReplaceMeterViewModel>{
      closingReadings: addClosingReadingsStepValue.readings.map(r => {
        return <ReadingViewModel>{
          meterId: meterId,
          date: r.date,
          readingSource: ReadingSource.ManualCapture,
          confirmed: r.confirmed,
          registerId: r.registerId,
          value: r.readings,
          notes: box({currentReadingNotes: 'testNote', currentReadingCreatedByUserName: 'testName'}),
          photo: addClosingReadingsFiles[r.registerTouKey]
        };
      }),
      meter: {
        id: state.wizardState.meterId,
        parentMeters: replaceEquipmentStepValue.parentMeters,
        serialNumber: replaceEquipmentStepValue.serialNumber,
        manufactureDate: replaceEquipmentStepValue.manufactureDate,
        supplyType: replaceEquipmentStepValue.supplyType,
        location: location,
        registers: replaceEquipmentStepValue.registers.map(r => {
          const register = {...r};
          const registerFile = replaceEquipmentRegisterFiles[register.id];
          if (registerFile) {
            register.photo = replaceEquipmentRegisterFiles[register.id].file;
          }

          register.sequenceNumber = replaceEquipmentStepValue.registers.indexOf(r);
          return register;
        }),
        equipmentTemplateId: replaceEquipmentStepValue.id,
        equipmentGroup: replaceEquipmentStepValue.equipmentGroup,
        isDisplayOBISCode: replaceEquipmentStepValue.isDisplayOBISCode,
        equipmentModel: replaceEquipmentStepValue.equipmentModel,
        attributes: replaceEquipmentStepValue.attributes && replaceEquipmentStepValue.attributes.map(a => ({
          attribute: a.attribute,
          value: a.value,
          numberValue: a.numberValue,
          photoUrl: a.photoUrl,
          photo: a.photo
        })),
        shopIds: shopIds,
        commonAreaIds: commonAreaIds,
        actualPhoto: actualPhoto,
        logoUrl: replaceEquipmentStepValue.equipmentPhotoUrl
      },
      nodes: nodes
    };
  }

  replaceMeter = (version: VersionViewModel<ReplaceMeterViewModel>, buildingId: string, actions: any[]) => {
    return this.meterService.replaceMeter(buildingId, version).pipe(map(r => {
      return [...actions,
        new commonDataActions.GetHistoryWithVersionId(r.current.id),
      ];
    }), catchError(() => {
      return [...actions, {type: 'DUMMY'}];
    }));
  }

  // Try navigate to next step
  tryNavigateNextStep = createEffect((): Observable<any> => this.actions$.pipe(
    ofType(replaceWizardAction.TRY_NEXT_STEP),
    withLatestFrom(
      this.store$.pipe(select(replaceWizardSelector.getWizardStepStates)),
      this.store$.pipe(select(replaceWizardSelector.getIsLocationWizard)),
      this.store$.pipe(select(addClosingReadingsSelector.getRegisterFiles)),
      this.store$.pipe(select(replaceEquipmentSelector.getRegisterFiles)),
      this.store$.pipe(select(commonData.getSelectedHistoryLog)),
      this.store$.pipe(select(commonData.getIsComplete)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      this.store$.pipe(select(commonData.getBuildingId)),
      (action: any, state: {
        wizardState: replaceWizardStore.State,
        addClosingReadingsState: addClosingReadingsStore.State,
        replaceEquipmentState: replaceEquipmentStore.State,
        replaceNodeTariffState: replaceNodeTariffStore.State
      }, isLocationWizard, addClosingReadingsFiles, equipmentRegistersFiles, selectedVersion, isComplete, versionId, buildingId) => {
        return {
          state: state,
          isLocationWizard: isLocationWizard,
          payload: action.payload,
          addClosingReadingsFiles: addClosingReadingsFiles,
          equipmentRegistersFiles: equipmentRegistersFiles,
          selectedVersion: selectedVersion,
          isComplete,
          versionId,
          buildingId
        };
      }),
    switchMap((params) => {

      const {
        isLocationWizard, state, payload, addClosingReadingsFiles,
        equipmentRegistersFiles, selectedVersion, isComplete, versionId, buildingId
      } = params;

      let actions = [];
      const actionType = isComplete ? state.wizardState.actionType : VersionActionType.Init;

      let date = null;
      if (actionType === VersionActionType.Insert) {
        date = state.wizardState.versionDate;
      } else if (selectedVersion) {
        date = selectedVersion.startDate;
      }

      switch (payload) {
        case this.SECOND_STEP: {
          actions.push(new MarkAsSubmittedAction(addClosingReadingsStore.FORM_ID));

          if (state.addClosingReadingsState.formState.isValid) {
            actions = [...actions,
              new replaceEquipmentActions.GetEquipmentTemplateRequest(),
              new replaceEquipmentActions.GetMetersRequest(),
              new replaceWizardAction.GoToStep(payload)
            ];
          }

          break;
        }

        case this.THIRD_STEP: {
          actions.push(new MarkAsSubmittedAction(replaceEquipmentStore.FORM_ID));

          if (state.replaceEquipmentState.formState.isValid) {
            actions = [...actions,
              new replaceNodeTariffActions.GetTariffsRequest(),
              new replaceNodeTariffActions.GetNodeRequest(),
              new replaceWizardAction.GoToStep(payload)
            ];
          }

          break;
        }

        case this.CLOSE_WIZARD: {
          const model: ReplaceMeterViewModel = this.compositMeterModel(state, addClosingReadingsFiles, equipmentRegistersFiles);
          const version: VersionViewModel<ReplaceMeterViewModel> = new VersionViewModel(model, state.wizardState.comment,
            actionType, date, versionId);
          actions.push(new replaceWizardAction.ToggleWizard());
          return this.replaceMeter(version, buildingId, actions);
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
}
