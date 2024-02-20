import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {SetValueAction} from 'ngrx-forms';
import * as replaceEquipmentActions
  from '../../actions/replace-equipment-wizard-actions/replace-equipment-step.actions';
import * as replaceEquipmentStore from '../../reducers/replace-equipment-wizard-reducers/replace-equipment-step.store';
import * as replaceEquipmentSelector from '../../selectors/replace-wizard-selectors/replace-equipment-step.selector';
import * as replaceWizardSelector from '../../selectors/replace-wizard-selectors/replace-wizard.selector';
import * as addClosingReadingsSelector
  from '../../selectors/replace-wizard-selectors/add-closing-readings-step.selector';
import * as commonData from '../../../../../shared/store/selectors/common-data.selectors';
import {MeterService} from '../../../meter.service';
import {EquipmentService} from '../../../../../../../../shared/services/equipment.service';
import {EquipmentUnitViewModel} from '@models';

@Injectable()
export class ReplaceEquipmentStepEffects {

  // Get list of equipment templates
  getEquipmentTemplates = createEffect(() => this.actions$.pipe(
    ofType(replaceEquipmentActions.GET_EQUIPMENT_TEMPLATES_REQUEST),
    withLatestFrom(this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(replaceWizardSelector.getSupplyType)),
      (_, buildingId, supplyType) => ({buildingId: buildingId, supplyType: supplyType})),
    switchMap(({buildingId, supplyType}) => {

      return this.meterService.getEquipments(buildingId).pipe(
        map(result => {
          const templates = result.filter(i => i.supplyType === supplyType);
          const selectedTemplateId = templates.length ? templates[0].id : null;
          this.store$.dispatch(new replaceEquipmentActions.GetEquipmentTemplateRequestComplete(templates));
          return {selectedTemplateId, buildingId};
        })
      );
    }),
    switchMap(({selectedTemplateId, buildingId}) => {
      return this.meterService.getEquipment(buildingId, selectedTemplateId).pipe(
        map(template => {
          this.store$.dispatch(new replaceEquipmentActions.SetSelectedTemplate(template));
          return new replaceEquipmentActions.EquipmentTemplateChanged(selectedTemplateId);
        })
      );
    })
  ));
  // Change selected device
  selectedDevices = createEffect(() => this.actions$.pipe(
    ofType(replaceEquipmentActions.EQUIPMENT_TEMPLATE_CHANGED),
    withLatestFrom(this.store$.pipe(select(replaceEquipmentSelector.getSelectedTemplate)),
      this.store$.pipe(select(addClosingReadingsSelector.getReplacementDate)),
      (action: any, selectedTemplate, date) =>
        ({equipmentTemplateId: action.payload, selectedTemplate, date: date})),
    switchMap(({equipmentTemplateId, selectedTemplate, date}) => {
      return this.equipmentService.getEquipmentTemplate(equipmentTemplateId).pipe(
        map(templateDetails => {
          return {selectedTemplate, templateDetails, date};
        })
      );
    }),
    switchMap(({selectedTemplate, templateDetails, date}) => {
      let formState = {};
      if (selectedTemplate) {
        let registers = selectedTemplate.registers || [];

        registers = registers.map(r => {
          const register = {...r};
          register.description = '';
          register['date'] = date;
          return register;
        });

        formState = {
          id: templateDetails.id,
          equipmentModel: templateDetails.equipmentModel,
          equipmentGroup: templateDetails.equipmentGroup,
          supplyType: templateDetails.supplyType,
          isDisplayOBISCode: templateDetails.isDisplayOBISCode,
          attributes: templateDetails.attributes.map(attr => {
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
          parentMeters: [],
          manufactureDate: null,
          equipmentPhotoUrl: templateDetails.logoUrl
        };
      } else {
        formState = replaceEquipmentStore.INIT_DEFAULT_STATE;
      }

      return of(new SetValueAction(replaceEquipmentStore.FORM_ID, formState));
    })
  ));
  // Get list of meters
  getMeters = createEffect(() => this.actions$.pipe(
    ofType(replaceEquipmentActions.GET_METERS_REQUEST),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      (_, buildingId, versionId) => ({buildingId: buildingId, buildingVersionId: versionId})),
    switchMap(({buildingId, buildingVersionId}) => {
      return this.meterService.getMeters(buildingId, buildingVersionId).pipe(
        map(items => new replaceEquipmentActions.GetMetersRequestComplete(items)),
        catchError(() => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));

  constructor(private actions$: Actions, private store$: Store<any>,
              private meterService: MeterService, private equipmentService: EquipmentService) {
  }
}
