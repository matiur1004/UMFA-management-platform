import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {SetValueAction} from 'ngrx-forms';

import * as fromEquipment from '../reducers';

import * as equipmentStepStore from '../reducers/equipment-step.store';
import * as locationStepStore from '../reducers/location-step.store';

import * as equipmentStepActions from '../actions/equipment-step.actions';
import * as commonData from '../../../../shared/store/selectors/common-data.selectors';
import {MeterEquipmentViewModel} from '../../models';
import {MeterService} from '../../meter.service';
import {EquipmentUnitViewModel} from '@models';
import {NotificationService} from '@services';


@Injectable()
export class EquipmentStepEffects {

  // Get list of equipment templates
  getEquipmentTemplates = createEffect(() => this.actions$.pipe(
    ofType(equipmentStepActions.GET_EQUIPMENT_TEMPLATES_REQUEST),
    withLatestFrom(this.store$.select(commonData.getBuildingId),
      this.store$.select(fromEquipment.getEquipmentStepState),
      (_, buildingId) => {
        return {
          buildingId: buildingId
        };
      }),
    switchMap(({buildingId}) => {
      return this.equipmentService.getEquipments(buildingId).pipe(
        map(items => {
          return new equipmentStepActions.GetEquipmentTemplateRequestComplete(items);
        }),
        catchError(() => {
          return of({type: 'DUMMY'});
        })
      );
    }),
    switchMap((action: any) => {

      const actions = [action];

      if (action.type !== 'DUMMY') {
        const items = action.payload;
        const itemId = items.length ? items[0].id : null;
        actions.push(new equipmentStepActions.EquipmentTemplateChanged(itemId));
      }

      return actions;
    })
  ));
  // Change selected device
  selectedDevices = createEffect(() => this.actions$.pipe(
    ofType(equipmentStepActions.EQUIPMENT_TEMPLATE_CHANGED),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(fromEquipment.getEquipmentStepFormState),
      this.store$.select(commonData.getActiveBuildingPeriod),
      this.store$.select(commonData.getUnitsOfMeasurement),
      (action: equipmentStepActions.EquipmentTemplateChanged, buildingId, equipmentStateForm, activeBuildingPeriod, unitsOfMeasurement) => {
        return {
          buildingId,
          equipmentTemplateId: action.payload,
          equipmentTemplate: null,
          equipmentStateForm,
          activeBuildingPeriod,
          unitsOfMeasurement
        };
      }),
    switchMap((effectParameters) => {
      if (!effectParameters.equipmentTemplateId) {
        this.notificationService.info('Please choose at least one template', 'Template');

        return of(effectParameters);
      }
      return this.equipmentService.getEquipment(effectParameters.buildingId, effectParameters.equipmentTemplateId).pipe(
        map(template => {
          effectParameters.equipmentTemplate = template;
          return effectParameters;
        })
      );
    }),
    switchMap(({equipmentTemplate, equipmentStateForm, activeBuildingPeriod, unitsOfMeasurement}) => {
      let formState: MeterEquipmentViewModel;
      const prevSupplyType = equipmentStateForm.value.supplyType;

      if (equipmentTemplate) {
        let registers = equipmentTemplate.registers || [];

        registers = registers.map(r => this.getFilledRegister(r, activeBuildingPeriod.startDate, unitsOfMeasurement));
        formState = Object.assign(new MeterEquipmentViewModel(), {
          id: equipmentTemplate.id,
          equipmentModel: equipmentTemplate.equipmentModel,
          equipmentGroup: equipmentTemplate.equipmentGroup,
          supplyType: equipmentTemplate.supplyType,
          isDisplayOBISCode: equipmentTemplate.isDisplayOBISCode,
          attributes: equipmentTemplate.attributes.map(attr => {
            return {
              attribute: {
                ...attr.attribute,
                unit: <EquipmentUnitViewModel>{
                  id: attr.attribute.unit ? attr.attribute.unit.id : null,
                  name: attr.attribute.unit ? attr.attribute.unit.name : null
                }
              },
              value: attr.value,
              numberValue: attr.numberValue
            };
          }) || [],
          registers: registers,
          serialNumber: null,
          manufactureDate: null,
          isDummy: false,
          isFaulty: false,
          reasonOfFaulty: '',
          equipmentPhotoUrl: equipmentTemplate.logoUrl
        });
      } else {
        formState = equipmentStepStore.INIT_DEFAULT_STATE;
      }

      let actions: any[] = [new SetValueAction(equipmentStepStore.FORM_ID, formState),
        new equipmentStepActions.SetSelectedTemplate(equipmentTemplate)];

      if (prevSupplyType !== formState.supplyType) {
        actions = [...actions, new SetValueAction(locationStepStore.InitState.controls.supplyId.id, ''),
          new SetValueAction(locationStepStore.InitState.controls.supplyName.id, '')];
      }

      return actions;
    })
  ));
  // Add register
  addRegister = createEffect(() => this.actions$.pipe(
    ofType(equipmentStepActions.ADD_REGISTER),
    withLatestFrom(
      this.store$.select(fromEquipment.getEquipmentStepFormState),
      this.store$.select(commonData.getActiveBuildingPeriod),
      this.store$.select(commonData.getUnitsOfMeasurement),
      (action: equipmentStepActions.EquipmentTemplateChanged, equipmentStateForm, activeBuildingPeriod, unitsOfMeasurement) => {
        return {
          register: action.payload,
          formState: equipmentStateForm,
          activeBuildingPeriod,
          unitsOfMeasurement
        };
      }),
    switchMap(({register, formState, activeBuildingPeriod, unitsOfMeasurement}) => {
      register = this.getFilledRegister(register, activeBuildingPeriod.startDate, unitsOfMeasurement);
      const form = {
        ...formState.value,
        registers: [...formState.value.registers, register]
      };

      return of(new SetValueAction(equipmentStepStore.FORM_ID, form));
    })
  ));
  // Remove register
  removeRegister = createEffect(() => this.actions$.pipe(
    ofType(equipmentStepActions.REMOVE_REGISTER),
    withLatestFrom(this.store$.select(fromEquipment.getEquipmentStepFormState),
      (action: equipmentStepActions.EquipmentTemplateChanged, equipmentStateForm) => {
        return {
          registerId: action.payload,
          formState: equipmentStateForm
        };
      }),
    switchMap(({registerId, formState}) => {

      const form = {
        ...formState.value,
        registers: formState.value.registers.filter(r => r.id != registerId)
      };

      return of(new SetValueAction(equipmentStepStore.FORM_ID, form));
    })
  ));
  // Get list of equipment templates
  getMeters = createEffect(() => this.actions$.pipe(
    ofType(equipmentStepActions.GET_METERS_REQUEST),
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
          return new equipmentStepActions.GetMetersRequestComplete(items);
        }),
        catchError(() => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));

  constructor(private actions$: Actions,
              private notificationService: NotificationService,
              private store$: Store<fromEquipment.State>,
              private equipmentService: MeterService) {
  }

  private getRegisterDate(startDate: string) {
    const date = new Date(startDate);
    return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
  }

  private getFilledRegister(r, startDate, unitsOfMeasurement) {
    const register = {...r};
    const date = this.getRegisterDate(startDate);
    register.useForBilling = r.isBilling;
    register.description = '';
    register.date = date;
    register.registerScaleId = r.registerScaleId ? r.registerScaleId : this.getDefaultRegisterScaleId(r, unitsOfMeasurement);
    return register;
  }

  private getDefaultRegisterScaleId(register, unitsOfMeasurement) {

    let defaultRegisterScaleId = '';

    if (unitsOfMeasurement.length) {
      const unitOfMeasurement = unitsOfMeasurement.find(r => r.unitType === register.unitOfMeasurement);
      defaultRegisterScaleId = unitOfMeasurement ? unitOfMeasurement.scales.find(item => item.isDefault).id : '';
    }

    return defaultRegisterScaleId;
  }
}
