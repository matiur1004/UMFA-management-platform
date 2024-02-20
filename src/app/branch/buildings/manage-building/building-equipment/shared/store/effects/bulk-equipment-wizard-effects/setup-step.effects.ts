import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {forkJoin, of} from 'rxjs';
import {catchError, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import * as setupStepActions from '../../actions/bulk-equipment-wizard-actions/setup-step.actions';

import * as fromEquipment from '../../reducers';
import * as setupStepSelectors from '../../reducers/bulk-equipment-wizard-reducers/selectors/setup-step.selectors';
import * as setupStepStore from '../../reducers/bulk-equipment-wizard-reducers/setup-step.store';

import {MeterService} from '../../../meter.service';
import {FormGroupState, SetValueAction} from 'ngrx-forms';
import {StringExtension} from 'app/shared/helper/string-extension';
import * as commonData from '../../../../../shared/store/selectors/common-data.selectors';

import {getSuppliesTo, updateDropdownData} from '../../utilities/bulk-wizard';
import {BulkDropdownType} from '../../../models';
import {EquipmentBulkStepActionType} from '@app/branch/buildings/manage-building/building-equipment/shared/models/bulk-action.model';
import {ngbDateNgrxValueConverter} from '@shared-helpers';
import {generateSerialNumber} from '@app/shared/helper/generate-serial-number';


@Injectable()
export class SetupStepEffects {

  // Init data
  initData = createEffect(() => this.actions$.pipe(
    ofType(setupStepActions.INIT_DATA),
    withLatestFrom(this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      (_, buildingId, versionId) => {
        return {
          buildingId: buildingId,
          versionId: versionId
        };
      }),
    switchMap(({buildingId, versionId}) => {
      const equipmentTemplates = this.meterService.getEquipments(buildingId);
      const equipmentGroups = this.meterService.getEquipmentGroups(buildingId);
      const locations = this.meterService.getLocations(buildingId, versionId);
      const supplies = this.meterService.getSupplies(buildingId, null);

      const join = forkJoin(equipmentTemplates, equipmentGroups, locations, supplies);

      return join.pipe(
        mergeMap(([equipmentTemplates, equipmentGroups, locations, supplies]) => {
          return [
            new setupStepActions.GetEquipmentTemplatesRequestComplete(equipmentTemplates),
            new setupStepActions.GetEquipmentGroupsRequestComplete(equipmentGroups),
            new setupStepActions.GetLocationsRequestComplete(locations),
            new setupStepActions.GetSuppliesRequestComplete(supplies),
            new setupStepActions.AddNewItem(null)
          ];
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Add new item
  addNewItem = createEffect(() => this.actions$.pipe(
    ofType(setupStepActions.ADD_NEW_ITEM),
    withLatestFrom(this.store$.select(setupStepSelectors.getFilteredDropdownData),
      this.store$.select(setupStepSelectors.getFormState),
      this.store$.select(setupStepSelectors.getEquipmentGroups),
      this.store$.select(setupStepSelectors.getEquipmentTemplates),
      this.store$.select(setupStepSelectors.getLocations),
      this.store$.select(setupStepSelectors.getSupplies),
      (action: any, filteredDropdownData, form, equipmentGroups, equipmentTemplates, locations, supplies) => {
        return {
          filteredDropdownData: filteredDropdownData,
          form: form,
          equipmentGroups: equipmentGroups,
          equipmentTemplates: equipmentTemplates,
          locations: locations,
          supplies: supplies
        };
      }),
    switchMap(({filteredDropdownData, form, equipmentGroups, equipmentTemplates, locations, supplies}) => {
      const dropdownData = {...filteredDropdownData};
      const id = StringExtension.NewGuid();
      const equipTemplates = equipmentGroups.length ? equipmentTemplates.filter(e => e.equipmentGroup.id === equipmentGroups[0].id) : [];
      const suppliesTo = equipmentGroups.length ? getSuppliesTo(supplies, equipmentGroups[0].supplyType) : [];

      let tempObj = updateDropdownData({},
        [BulkDropdownType.EquipmentGroups, BulkDropdownType.SelectedEquipmentGroup], equipmentGroups, null);
      tempObj = updateDropdownData(tempObj, [BulkDropdownType.EquipmentTemplates, BulkDropdownType.SelectDevice], equipTemplates, null);
      tempObj = updateDropdownData(tempObj, [BulkDropdownType.Locations, BulkDropdownType.SelectedLocation], locations, null);
      tempObj = updateDropdownData(tempObj, [BulkDropdownType.Supplies, BulkDropdownType.SelectedSupplyTo], suppliesTo, null);

      if (suppliesTo.length) {
        const supply = suppliesTo[0];
        const supplyToLocations = supply && supply.supplyTypes.length ? supply.supplyTypes[0].supplyToLocations : [];

        tempObj = updateDropdownData(tempObj,
          [BulkDropdownType.LocationTypes, BulkDropdownType.SelectedLocationType], supplyToLocations, null);
      }

      const serialNumber = generateSerialNumber();
      const newItem = {
        id: id,
        equipmentGroupId: tempObj[BulkDropdownType.SelectedEquipmentGroup] ? tempObj[BulkDropdownType.SelectedEquipmentGroup].id : null,
        deviceId: tempObj[BulkDropdownType.SelectDevice] ? tempObj[BulkDropdownType.SelectDevice].id : null,
        numberOfEquipmentTemplate: 1,
        serialNumber: serialNumber,
        photo: null,
        manufactureDate: new Date().toISOString(),
        isSelected: false,
        locationId: tempObj[BulkDropdownType.SelectedLocation] ? tempObj[BulkDropdownType.SelectedLocation].id : null,
        supplyToId: tempObj[BulkDropdownType.SelectedSupplyTo] ? tempObj[BulkDropdownType.SelectedSupplyTo].id : null,
        locationType: tempObj[BulkDropdownType.SelectedLocationType] ? tempObj[BulkDropdownType.SelectedLocationType].name : null
      };

      dropdownData[id] = tempObj;

      const templates = [...form.value.templates, newItem];
      const formValue = {...form.value, templates};

      return [
        new SetValueAction(setupStepStore.FORM_ID, formValue),
        new setupStepActions.SetDropdownData(dropdownData)
      ];
    })
  ));
  applyBulkValue = createEffect(() => this.actions$.pipe(
    ofType(setupStepActions.APPLY_BULK_VALUE),
    withLatestFrom(this.store$.select(setupStepSelectors.getFormState),
      (action: setupStepActions.ApplyBulkValue, form) => {
        return {
          bulkAction: action.payload.bulkAction,
          bulkValue: action.payload.bulkValue,
          form: form,
        };
      }),
    map(({bulkAction, bulkValue, form}) => {

      switch (bulkAction) {
        case EquipmentBulkStepActionType.SetNumber: {
          const formValue = this.getFormValue(bulkValue, form, 'numberOfEquipmentTemplate');
          return new SetValueAction(setupStepStore.FORM_ID, formValue);
        }

        case EquipmentBulkStepActionType.SetManufactureDate: {
          const date = ngbDateNgrxValueConverter.convertViewToStateValue(bulkValue);
          const formValue = this.getFormValue(date, form, 'manufactureDate');
          return new SetValueAction(setupStepStore.FORM_ID, formValue);
        }

        case EquipmentBulkStepActionType.SetLocation: {
          const formValue = this.getFormValue(bulkValue, form, 'locationId');
          return new SetValueAction(setupStepStore.FORM_ID, formValue);
        }

        case EquipmentBulkStepActionType.SetDevice: {
          let templates = [...form.value.templates];

          Object.keys(bulkValue).forEach(groupId => {
            const device = bulkValue[groupId]['device'];
            templates = [...templates].map(m => {
              if (m.isSelected && m.equipmentGroupId === groupId) {
                return {
                  ...m,
                  deviceId: device
                };
              }
              return m;
            });
          });

          return new SetValueAction(setupStepStore.FORM_ID, {templates});
        }
      }
    })
  ));
  // equipment group change
  equipmentGroupChange = createEffect(() => this.actions$.pipe(
    ofType(setupStepActions.EQUIPMENT_GROUP_CHANGED),
    withLatestFrom(this.store$.select(setupStepSelectors.getFilteredDropdownData),
      this.store$.select(setupStepSelectors.getFormState),
      this.store$.select(setupStepSelectors.getEquipmentGroups),
      this.store$.select(setupStepSelectors.getEquipmentTemplates),
      this.store$.select(setupStepSelectors.getSupplies),
      (action: any, filteredDropdownData, form, equipmentGroups, equipmentTemplates, supplies) => {
        return {
          id: action.payload.id,
          equipmentGroupId: action.payload.equipmentGroupId,
          filteredDropdownData: filteredDropdownData,
          form: form,
          equipmentGroups: equipmentGroups,
          equipmentTemplates: equipmentTemplates,
          supplies: supplies
        };
      }),
    switchMap(({id, equipmentGroupId, filteredDropdownData, form, equipmentGroups, equipmentTemplates, supplies}) => {
      const dropdownData = {...filteredDropdownData};
      const templates = [...form.value.templates];
      const equipTemplates = equipmentTemplates.filter(e => e.equipmentGroupId === equipmentGroupId);
      const suppliesTo = getSuppliesTo(supplies, equipmentGroups.find(g => g.id === equipmentGroupId).supplyType);

      let tempObj = dropdownData[id];
      tempObj = updateDropdownData(tempObj,
        [BulkDropdownType.EquipmentGroups, BulkDropdownType.SelectedEquipmentGroup], equipmentGroups, equipmentGroupId);
      tempObj = updateDropdownData(tempObj, [BulkDropdownType.EquipmentTemplates, BulkDropdownType.SelectDevice], equipTemplates, null);
      tempObj = updateDropdownData(tempObj, [BulkDropdownType.Supplies, BulkDropdownType.SelectedSupplyTo], suppliesTo, null);

      if (suppliesTo.length) {
        const supply = suppliesTo[0];
        const supplyToLocations = supply && supply.supplyTypes.length ? supply.supplyTypes[0].supplyToLocations : [];

        tempObj = updateDropdownData(tempObj,
          [BulkDropdownType.LocationTypes, BulkDropdownType.SelectedLocationType], supplyToLocations, null);
      }

      const index = templates.findIndex(t => t.id === id);
      templates.splice(index, 1, {
        ...templates[index],
        equipmentGroupId: equipmentGroupId,
        deviceId: tempObj[BulkDropdownType.SelectDevice] ? tempObj[BulkDropdownType.SelectDevice].id : null,
        supplyToId: tempObj[BulkDropdownType.SelectedSupplyTo] ? tempObj[BulkDropdownType.SelectedSupplyTo].id : null,
        locationType: tempObj[BulkDropdownType.SelectedLocationType] ? tempObj[BulkDropdownType.SelectedLocationType].name : null
      });

      const formValue = {...form.value, templates};

      dropdownData[id] = tempObj;

      return [
        new SetValueAction(setupStepStore.FORM_ID, formValue),
        new setupStepActions.SetDropdownData(dropdownData)
      ];
    })
  ));
  // equipment template change
  equipmentTemplateChange = createEffect(() => this.actions$.pipe(
    ofType(setupStepActions.DEVICE_CHANGED),
    withLatestFrom(this.store$.select(setupStepSelectors.getFilteredDropdownData),
      this.store$.select(setupStepSelectors.getFormState),
      this.store$.select(setupStepSelectors.getEquipmentTemplates),
      (action: any, filteredDropdownData, form, equipmentTemplates) => {
        return {
          id: action.payload.id,
          equipmentTemplateId: action.payload.equipmentTemplateId,
          filteredDropdownData: filteredDropdownData,
          form: form,
          equipmentTemplates: equipmentTemplates
        };
      }),
    switchMap(({id, equipmentTemplateId, filteredDropdownData, form, equipmentTemplates}) => {
      const dropdownData = {...filteredDropdownData};
      const templates = [...form.value.templates];
      let tempObj = dropdownData[id];

      const equipTemplates = equipmentTemplates.filter(e => e.equipmentGroupId === templates.find(t => t.id === id).equipmentGroupId);
      tempObj = updateDropdownData(tempObj,
        [BulkDropdownType.EquipmentTemplates, BulkDropdownType.SelectDevice], equipTemplates, equipmentTemplateId);

      const index = templates.findIndex(t => t.id === id);
      templates.splice(index, 1, {
        ...templates[index],
        equipmentId: tempObj[BulkDropdownType.SelectDevice] ? tempObj[BulkDropdownType.SelectDevice].id : null
      });

      const formValue = {...form.value, templates};

      dropdownData[id] = tempObj;

      return [
        new SetValueAction(setupStepStore.FORM_ID, formValue),
        new setupStepActions.SetDropdownData(dropdownData)
      ];
    })
  ));
  // Location change
  locationChange = createEffect(() => this.actions$.pipe(
    ofType(setupStepActions.LOCATION_CHANGED),
    withLatestFrom(this.store$.select(setupStepSelectors.getFilteredDropdownData),
      this.store$.select(setupStepSelectors.getFormState),
      this.store$.select(setupStepSelectors.getLocations),
      (action: any, filteredDropdownData, form, locations) => {
        return {
          id: action.payload.id,
          locationId: action.payload.locationId,
          filteredDropdownData: filteredDropdownData,
          form: form,
          locations: locations
        };
      }),
    switchMap(({id, locationId, filteredDropdownData, form, locations}) => {
      const dropdownData = {...filteredDropdownData};
      const templates = [...form.value.templates];

      let tempObj = dropdownData[id];

      tempObj = updateDropdownData(tempObj, [BulkDropdownType.Locations, BulkDropdownType.SelectedLocation], locations, locationId);

      const index = templates.findIndex(t => t.id === id);
      templates.splice(index, 1, {
        ...templates[index],
        locationId: tempObj[BulkDropdownType.SelectedLocation] ? tempObj[BulkDropdownType.SelectedLocation].id : null
      });

      const formValue = {...form.value, templates};

      dropdownData[id] = tempObj;

      return [
        new SetValueAction(setupStepStore.FORM_ID, formValue),
        new setupStepActions.SetDropdownData(dropdownData)
      ];
    })
  ));
  // Supply to change
  supplyToChange = createEffect(() => this.actions$.pipe(
    ofType(setupStepActions.SUPPLIE_CHANGED),
    withLatestFrom(this.store$.select(setupStepSelectors.getFilteredDropdownData),
      this.store$.select(setupStepSelectors.getFormState),
      (action: any, filteredDropdownData, form) => {
        return {
          id: action.payload.id,
          supplyToId: action.payload.supplyToId,
          filteredDropdownData: filteredDropdownData,
          form: form
        };
      }),
    switchMap(({id, supplyToId, filteredDropdownData, form}) => {
      const dropdownData = {...filteredDropdownData};
      const templates = [...form.value.templates];
      let tempObj = dropdownData[id];
      const suppliesTo = [...tempObj[BulkDropdownType.Supplies]];

      tempObj = updateDropdownData(tempObj, [BulkDropdownType.Supplies, BulkDropdownType.SelectedSupplyTo], suppliesTo, supplyToId);

      const supplyTypes = suppliesTo.find(s => s.id === supplyToId).supplyTypes;
      const supplyToLocations = supplyTypes.length ? supplyTypes[0].supplyToLocations : [];

      tempObj = updateDropdownData(tempObj,
        [BulkDropdownType.LocationTypes, BulkDropdownType.SelectedLocationType], supplyToLocations, null, 'name');

      const index = templates.findIndex(t => t.id === id);
      templates.splice(index, 1, {
        ...templates[index],
        supplyToId: tempObj[BulkDropdownType.SelectedSupplyTo] ? tempObj[BulkDropdownType.SelectedSupplyTo].id : null,
        locationType: tempObj[BulkDropdownType.SelectedLocationType] ? tempObj[BulkDropdownType.SelectedLocationType].name : null
      });

      const formValue = {...form.value, templates};

      dropdownData[id] = tempObj;

      return [
        new SetValueAction(setupStepStore.FORM_ID, formValue),
        new setupStepActions.SetDropdownData(dropdownData)
      ];
    })
  ));
  
  // Location type change
  locationTypeChange = createEffect(() => this.actions$.pipe(
    ofType(setupStepActions.LOCATION_TYPE_CHANGED),
    withLatestFrom(this.store$.select(setupStepSelectors.getFilteredDropdownData),
      this.store$.select(setupStepSelectors.getFormState),
      (action: any, filteredDropdownData, form) => {
        return {
          id: action.payload.id,
          locationType: action.payload.locationType,
          filteredDropdownData: filteredDropdownData,
          form: form,
        };
      }),
    switchMap(({id, locationType, filteredDropdownData, form}) => {
      const dropdownData = {...filteredDropdownData};
      const templates = [...form.value.templates];
      let tempObj = dropdownData[id];
      const supplyToLocations = [...tempObj[BulkDropdownType.LocationTypes]];

      tempObj = updateDropdownData(tempObj,
        [BulkDropdownType.LocationTypes, BulkDropdownType.SelectedLocationType], supplyToLocations, locationType, 'name');

      const index = templates.findIndex(t => t.id === id);
      templates.splice(index, 1, {
        ...templates[index],
        locationType: tempObj[BulkDropdownType.SelectedLocationType] ? tempObj[BulkDropdownType.SelectedLocationType].name : null
      });

      const formValue = {...form.value, templates};

      dropdownData[id] = tempObj;

      return [
        new SetValueAction(setupStepStore.FORM_ID, formValue),
        new setupStepActions.SetDropdownData(dropdownData)
      ];
    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<fromEquipment.State>,
    private meterService: MeterService
  ) {
  }

  getFormValue(bulkValue: any, form: FormGroupState<setupStepStore.FormValue>, dataName: string) {
    return {
      templates: form.value.templates.map(m => {
          if (m.isSelected) {
            return {
              ...m,
              [dataName]: bulkValue,
            };
          } else {
            return m;
          }
        }
      )
    };
  }
}
