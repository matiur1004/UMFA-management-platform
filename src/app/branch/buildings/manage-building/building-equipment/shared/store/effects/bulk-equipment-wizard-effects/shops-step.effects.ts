import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {forkJoin, of} from 'rxjs';
import {catchError, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {Boxed, SetValueAction} from 'ngrx-forms';

import * as shopsStepActions from '../../actions/bulk-equipment-wizard-actions/shops-step.actions';

import * as fromEquipment from '../../reducers';

import * as shopsStepStore from '../../reducers/bulk-equipment-wizard-reducers/shops-step.store';

import * as shopsStepSelectors from '../../reducers/bulk-equipment-wizard-reducers/selectors/shops-step.selectors';
import * as commonData from '../../../../../shared/store/selectors/common-data.selectors';

import {MeterService} from '../../../meter.service';

import {updateDropdownData} from '../../utilities/bulk-wizard';
import {BulkDropdownType} from '../../../models';
import {ShopsStepActionType, ShopStepDescriptionFieldType} from '@app/branch/buildings/manage-building/building-equipment/shared/models/bulk-action.model';
import { SupplyTypeText } from '@app/shared/models';
import { ParentMeterByGroupPipe } from '@app/shared/pipes/parent-meter-by-group.pipe';
import { moveItemInArray } from '@angular/cdk/drag-drop';


@Injectable()
export class ShopsStepEffects {

  // Get shops and common areas
  getShopsAndCommonAreas = createEffect(() => this.actions$.pipe(
    ofType(shopsStepActions.INIT_SHOPS_AND_COMMON_AREAS),
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
      const shops = this.meterService.getShops(buildingId, versionId);
      const commonAreas = this.meterService.getCommonAreas(buildingId, versionId);

      const join = forkJoin(shops, commonAreas);
      return join.pipe(
        mergeMap(([shops, commonAreas]) => {
          return [
            new shopsStepActions.SetShops(shops),
            new shopsStepActions.SetCommonAreas(commonAreas)
          ];
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Supply to change
  supplyToChange = createEffect(() => this.actions$.pipe(
    ofType(shopsStepActions.SUPPLY_TO_CHANGED),
    withLatestFrom(this.store$.select(shopsStepSelectors.getMeterDropdownData),
      this.store$.select(shopsStepSelectors.getFormState),
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

      let tempObj = dropdownData[id];

      const suppliesTo = [...tempObj[BulkDropdownType.Supplies]];

      tempObj = updateDropdownData(tempObj, [BulkDropdownType.Supplies, BulkDropdownType.SelectedSupplyTo], suppliesTo, supplyToId);

      const supplyTypes = suppliesTo.find(s => s.id === supplyToId).supplyTypes;

      const supplyToLocations = supplyTypes.length ? supplyTypes[0].supplyToLocations : [];

      tempObj = updateDropdownData(tempObj, [BulkDropdownType.LocationTypes, BulkDropdownType.SelectedLocationType], supplyToLocations, null, 'name');

      const meters = [...form.value.meters];
      const index = meters.findIndex(t => t.id === id);

      meters.splice(index, 1, {
        ...meters[index],
        supplyToId: tempObj[BulkDropdownType.SelectedSupplyTo].id,
        locationType: tempObj[BulkDropdownType.SelectedLocationType] ? tempObj[BulkDropdownType.SelectedLocationType].name : null
      });
      if(meters[index]['descriptionField'] == ShopStepDescriptionFieldType.SupplyTo) {
        meters.splice(index, 1, {...meters[index], description: tempObj[BulkDropdownType.SelectedSupplyTo].name + ' - ' + SupplyTypeText[meters[index]['supplyType']].slice(0, 1)});
      }
      if(meters[index]['descriptionField'] == ShopStepDescriptionFieldType.LocationType) {
        meters.splice(index, 1, {...meters[index], description: meters[index]['locationType'] + ' - ' + SupplyTypeText[meters[index]['supplyType']].slice(0, 1)});
      } 

      const locationGroupMeters = this.updateGroupMetersWithMeters(form.value.locationGroupMeters, meters[index]);
      const formValue = {...form.value, locationGroupMeters, meters};

      dropdownData[id] = tempObj;

      return [
        new SetValueAction(shopsStepStore.FORM_ID, formValue),
        new shopsStepActions.SetDropdownData(dropdownData)
      ];
    })
  ));
  // Location type change
  locationTypeChange = createEffect(() => this.actions$.pipe(
    ofType(shopsStepActions.LOCATION_TYPE_CHANGED),
    withLatestFrom(this.store$.select(shopsStepSelectors.getMeterDropdownData),
      this.store$.select(shopsStepSelectors.getFormState),
      (action: any, filteredDropdownData, form) => {
        return {
          id: action.payload.id,
          locationType: action.payload.locationType,
          filteredDropdownData: filteredDropdownData,
          form: form
        };
      }),
    switchMap(({id, locationType, filteredDropdownData, form}) => {
      const dropdownData = {...filteredDropdownData};

      let tempObj = dropdownData[id];

      const supplyToLocations = [...tempObj[BulkDropdownType.LocationTypes]];

      tempObj = updateDropdownData(tempObj, [BulkDropdownType.LocationTypes, BulkDropdownType.SelectedLocationType], supplyToLocations, locationType, 'name');

      const meters = [...form.value.meters];
      const index = meters.findIndex(t => t.id === id);

      meters.splice(index, 1, {...meters[index], locationType: tempObj[BulkDropdownType.SelectedLocationType].name});
      if(meters[index]['descriptionField'] == ShopStepDescriptionFieldType.LocationType) {
        meters.splice(index, 1, {...meters[index], description: meters[index]['locationType'] + ' - ' + SupplyTypeText[meters[index]['supplyType']].slice(0, 1)});
      }

      const locationGroupMeters = this.updateGroupMetersWithMeters(form.value.locationGroupMeters, meters[index]);
      const formValue = {...form.value, locationGroupMeters, meters};

      dropdownData[id] = tempObj;

      return [
        new SetValueAction(shopsStepStore.FORM_ID, formValue),
        new shopsStepActions.SetDropdownData(dropdownData)
      ];
    })
  ));

  // Unit change
  unitChange = createEffect(() => this.actions$.pipe(
    ofType(shopsStepActions.UNIT_CHNAGED),
    withLatestFrom(
      this.store$.select(shopsStepSelectors.getMeterDropdownData),
      this.store$.select(shopsStepSelectors.getFormState),
      this.store$.select(shopsStepSelectors.getUnitOptions),
      (action: any, filteredDropdownData, form, unitOptions) => {
        return {
          locationId: action.payload.locationId,
          id: action.payload.id,
          filteredDropdownData: filteredDropdownData,
          form: form,
          unitOptions
        };
      }),
    switchMap(({id, form, unitOptions}) => {      
      const meters = [...form.value.meters];
      const index = meters.findIndex(t => t.id === id);
      if(meters[index]['descriptionField'] == ShopStepDescriptionFieldType.Units) {
        let unitIds = meters[index]['unitIds']['value'];
        let unitNameArray = [];
        unitOptions.forEach(unit => {
          if(unitIds.indexOf(unit.id) > -1) {
            unitNameArray.push(unit.name);
          }
        })
        meters.splice(index, 1, {...meters[index], unitName: unitNameArray.join(', '), description: unitNameArray.join(', ') + '- ' + SupplyTypeText[meters[index]['supplyType']].slice(0, 1)});
      }

      const locationGroupMeters = this.updateGroupMetersWithMeters(form.value.locationGroupMeters, meters[index]);
      const formValue = {...form.value, meters, locationGroupMeters};

      return [
        new SetValueAction(shopsStepStore.FORM_ID, formValue),
      ];
    })
  ));

  // Serial Number change
  serialNumberChange = createEffect(() => this.actions$.pipe(
    ofType(shopsStepActions.SERIAL_NUMBER_CHANGED),
    withLatestFrom(
      this.store$.select(shopsStepSelectors.getFormState),
      (action: any, form) => {
        return {
          id: action.payload.id,
          serialNumber: action.payload.serialNumber,
          form: form,
        };
      }),
    switchMap(({id, form}) => {
      const meters = [...form.value.meters];
      const index = meters.findIndex(t => t.id === id);      
      if(meters[index]['descriptionField'] == ShopStepDescriptionFieldType.SerialNumber) {
        meters.splice(index, 1, {...meters[index], description: meters[index]['serialNumber'] + '- ' + SupplyTypeText[meters[index]['supplyType']].slice(0, 1)});
      }

      const locationGroupMeters = this.updateGroupMetersWithMeters(form.value.locationGroupMeters, meters[index]);      
      const formValue = {...form.value, meters: meters, locationGroupMeters: locationGroupMeters};

      return [
        new SetValueAction(shopsStepStore.FORM_ID, formValue)
      ];
    })
  ));

  // order change
  orderChange = createEffect(() => this.actions$.pipe(
    ofType(shopsStepActions.UPDATE_ORDER_METERS),
    withLatestFrom(
      this.store$.select(shopsStepSelectors.getFormState),
      (action: any, form) => {
        return {
          locationId: action.payload.locationId,
          id: action.payload.id,
          previousIndex: action.payload.previousIndex,
          currentIndex: action.payload.currentIndex,
          form: form,
        };
      }),
    switchMap(({locationId, id, previousIndex, currentIndex, form}) => {
      let meters = [...form.value.meters];
      moveItemInArray(meters, previousIndex, currentIndex);
      
      const formValue = {...form.value, meters: meters};

      return [
        new SetValueAction(shopsStepStore.FORM_ID, formValue)
      ];
    })
  ));

  // Parent change
  parentChange = createEffect(() => this.actions$.pipe(
    ofType(shopsStepActions.PARENT_CHANGED),
    withLatestFrom(
      this.store$.select(shopsStepSelectors.getFormState),
      (action: any, form) => {
        return {
          locationId: action.payload.locationId,
          id: action.payload.id,
          groupId: action.payload.groupId,
          locationType: action.payload.locationType,
          existMeters: action.payload.existMeters,
          newMeters: action.payload.newMeters,
          form: form,
        };
      }),
    switchMap(({locationId, id, groupId, locationType, existMeters, newMeters, form}) => {
      const meters = [...form.value.meters];
      const index = meters.findIndex(t => t.id === id);          
      let parentMeterPipe = new ParentMeterByGroupPipe();
      let parentMeterItems = parentMeterPipe.transform(meters[index], existMeters, newMeters);
      if(meters[index]['descriptionField'] == ShopStepDescriptionFieldType.Parent) {
        let meterNameArray = [];
        meters[index]['parentMeters']['value'].forEach(parentId => {
          let meter = parentMeterItems.find(parent => parent.id == parentId);
          meterNameArray.push(meter['name']);
        });
        meters.splice(index, 1, {...meters[index], description: meterNameArray.join(', ')});
      }
      const locationGroupMeters = this.updateGroupMetersWithMeters(form.value.locationGroupMeters, meters[index]);      
      const formValue = {...form.value, meters, locationGroupMeters};

      return [
        new SetValueAction(shopsStepStore.FORM_ID, formValue)
      ];
    })
  ));

  // Apply bulk value
  applyBulkValue = createEffect(() => this.actions$.pipe(
    ofType(shopsStepActions.APPLY_BULK_VALUE),
    withLatestFrom(this.store$.select(shopsStepSelectors.getMeterDropdownData),
      this.store$.select(shopsStepSelectors.getFormState),
      (action: any, filteredDropdownData, form) => {
        return {
          bulkAction: action.payload.bulkAction,
          bulkValue: action.payload.bulkValue,
          descriptionValue: action.payload.description,
          filteredDropdownData: filteredDropdownData,
          form: form
        };
      }),
    switchMap(({bulkAction, bulkValue, descriptionValue, filteredDropdownData, form}) => {
      const dropdownData = {...filteredDropdownData};
      switch (bulkAction) {
        case ShopsStepActionType.SelectSupplyToAndLocationType: {
          const formValue = {
            locationGroupMeters: form.value.locationGroupMeters.map(gm => {
              return {
                ...gm,
                meters: gm.meters.map(m => {
                  if (m.isSelected) {

                    return {
                      ...m,
                      supplyToId: bulkValue[m.equipmentGroupId] ? bulkValue[m.equipmentGroupId].supplyToId : m.supplyToId,
                      locationType: bulkValue[m.equipmentGroupId] ? bulkValue[m.equipmentGroupId].locationName : m.locationType
                    };
                  } else {
                    return m;
                  }
                })
              };
            })
          };
          return [
            new SetValueAction(shopsStepStore.FORM_ID, formValue),
            new shopsStepActions.SetDropdownData(dropdownData)
          ];
        }

        case ShopsStepActionType.SetDescription: {
          let meters = [...form.value.meters];
          const locationGroupMeters = form.value.locationGroupMeters.map(gm => {
            return {
              ...gm,
              meters: gm.meters.map(m => {
                let meterIdx = meters.findIndex(meter => meter.id == m.id);
                m = {...m, isSelected: meters[meterIdx]['isSelected']};
                if (m.isSelected) {
                  m = {...m, descriptionField: bulkValue};
                  let description = '';
                  if(bulkValue == ShopStepDescriptionFieldType.SerialNumber) {
                    description = m.serialNumber;
                  } else if(bulkValue == ShopStepDescriptionFieldType.EquipmentGroup) {
                    description = m.equipmentGroupName;
                  } else if(bulkValue == ShopStepDescriptionFieldType.DeviceType) {
                    description = m.deviceTypeName;
                  } else if(bulkValue == ShopStepDescriptionFieldType.Units) {
                    description = m.unitName;
                  } else if (bulkValue == ShopStepDescriptionFieldType.LocationType) {
                    description = m.locationType;
                  } else if (bulkValue == ShopStepDescriptionFieldType.SupplyTo) {
                    let tempObj = dropdownData[m.id];

                    const suppliesTo = [...tempObj[BulkDropdownType.Supplies]];

                    tempObj = updateDropdownData(tempObj, [BulkDropdownType.Supplies, BulkDropdownType.SelectedSupplyTo], suppliesTo, m.supplyToId);

                    const supplyTypes = suppliesTo.find(s => s.id === m.supplyToId).supplyTypes;

                    const supplyToLocations = supplyTypes.length ? supplyTypes[0].supplyToLocations : [];

                    tempObj = updateDropdownData(tempObj, [BulkDropdownType.LocationTypes, BulkDropdownType.SelectedLocationType], supplyToLocations, null, 'name');
                    description = tempObj[BulkDropdownType.SelectedSupplyTo].name;
                  } else if (bulkValue == ShopStepDescriptionFieldType.FreeText) {
                    description = descriptionValue;
                  }
                  if(bulkValue != ShopStepDescriptionFieldType.FreeText) 
                    description = description ? description + ' - ' + SupplyTypeText[m.supplyType].slice(0, 1) : '';

                  meters.splice(meterIdx, 1, {...meters[meterIdx], description: description, descriptionField: bulkValue});
                  return {
                    ...m,
                    description: description
                  };
                } else {
                  return m;
                }
              })
            };
          });
          
          const formValue = {
            ...form.value,
            locationGroupMeters,
            meters
          };
          return [new SetValueAction(shopsStepStore.FORM_ID, formValue)];
        }
        case ShopsStepActionType.SetUnits: {
          const formValue = {
            locationGroupMeters: form.value.locationGroupMeters.map(gm => {
              return {
                ...gm,
                meters: gm.meters.map(m => {
                  if (m.isSelected) {
                    const unitIds: Boxed<string[]> = {
                      __boxed: '',
                      value: []
                    };

                    unitIds.value = bulkValue;
                    return {
                      ...m,
                      unitIds: unitIds
                    };
                  } else {
                    return m;
                  }
                })
              };
            })
          };
          return [new SetValueAction(shopsStepStore.FORM_ID, formValue)];
        }
        case ShopsStepActionType.SetParentMeter: {
          let locationGroupMeters = [];
          Object.keys(bulkValue).forEach(key => {
            const parentMeters = bulkValue[key]['parentMeters'];
            locationGroupMeters = form.value.locationGroupMeters.map(gm => {
              return {
                ...gm,
                meters: gm.meters.map(m => {
                  if (m.isSelected) {
                    const parentMetersBox: Boxed<string[]> = {
                      __boxed: '',
                      value: []
                    };

                    parentMetersBox.value = parentMeters;

                    return {
                      ...m,
                      parentMeters: parentMetersBox
                    };
                  } else {
                    return m;
                  }
                })
              };
            });
          });

          const formValue = {
            locationGroupMeters
          };

          return [new SetValueAction(shopsStepStore.FORM_ID, formValue)];
        }
      }
    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<fromEquipment.State>,
    private meterService: MeterService
  ) {
  }

  private updateGroupMetersWithMeters(groupMeters, meter) {
    const locationGroupMeters = groupMeters.map(gm => {
      return {
        ...gm,
        meters: gm.meters.map(m => {
          if(m.id == meter['id']) {
            return {
              ...m,
              ...meter
            }
          } else {
            return m
          }
        })
      };
    })
    return locationGroupMeters;
  }
}
