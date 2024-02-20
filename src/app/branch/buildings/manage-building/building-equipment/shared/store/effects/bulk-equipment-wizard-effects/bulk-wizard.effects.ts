import {Injectable} from '@angular/core';
import {
  EquipmentGroupViewModel,
  EquipmentTemplateViewModel,
  FieldType,
  TemplateListItemViewModel,
  UnitType,
  VersionActionType,
  VersionViewModel
} from '@models';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {FileExtension, StringExtension} from '@shared-helpers';
import {BuildingPeriodViewModel} from 'app/branch/buildings/manage-building/shared/models/building-period.model';
import {box, MarkAsSubmittedAction, ResetAction, SetValueAction, unbox} from 'ngrx-forms';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';

import * as commonDataActions from '../../../../../shared/store/actions/common-data.action';
import * as commonData from '../../../../../shared/store/selectors/common-data.selectors';
import {LocationService} from '../../../location.service';

import {MeterService} from '../../../meter.service';

import {BulkDropdownType, MeterEquipmentViewModel, MeterWriteViewModel} from '../../../models';
import { ShopStepDescriptionFieldType } from '../../../models/bulk-action.model';
import * as bulkWizardActions from '../../actions/bulk-equipment-wizard-actions/bulk-wizard.actions';
import * as registersAndReadingsStepActions
  from '../../actions/bulk-equipment-wizard-actions/registers-and-readings-step.actions';
import * as shopsStepActions from '../../actions/bulk-equipment-wizard-actions/shops-step.actions';

import * as fromEquipment from '../../reducers';
import * as attributesStepStore from '../../reducers/bulk-equipment-wizard-reducers/attributes-step.store';

import * as bulkWizardStore from '../../reducers/bulk-equipment-wizard-reducers/bulk-wizard.store';
import * as registersAndReadingsStepStore
  from '../../reducers/bulk-equipment-wizard-reducers/registers-and-readings-step.store';
import * as bulkWizardSelectors from '../../reducers/bulk-equipment-wizard-reducers/selectors/bulk-wizard.selectors';
import * as registersAndReadingsSelectors
  from '../../reducers/bulk-equipment-wizard-reducers/selectors/registers-and-readings.selectors';
import * as shopsSelectors from '../../reducers/bulk-equipment-wizard-reducers/selectors/shops-step.selectors';
import * as setupStepStore from '../../reducers/bulk-equipment-wizard-reducers/setup-step.store';
import * as shopsStepStore from '../../reducers/bulk-equipment-wizard-reducers/shops-step.store';
import {
  LocationGroupMetersFormValue,
  UnitMetersFormValue
} from '../../reducers/bulk-equipment-wizard-reducers/shops-step.store';

import {getSuppliesTo, updateDropdownData} from '../../utilities/bulk-wizard';
import {sortFunc} from '../../utilities/sortFunc';

@Injectable()
export class BulkWizardEffects {

  readonly AMPERAGE_ATTRIBUTE = 'amperage';

  readonly FIRST_STEP: number = 1;
  readonly SECOND_STEP: number = 2;
  readonly THIRD_STEP: number = 3;
  readonly CLOSE_WIZARD: number = 4;
  // Check locations
  checkLocation = createEffect(() => this.actions$.pipe(
    ofType(bulkWizardActions.GET_LOCATION),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      (_, buildingId, versionId) => {
        return {
          buildingId: buildingId,
          versionId: versionId
        };
      }),
    switchMap(({buildingId, versionId}) => {

      return this.locationService.getDefaultLocation(buildingId, versionId).pipe(
        map(() => {
          return new bulkWizardActions.ToggleWizard();
        }),
        catchError(() => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Reset bulk wizard
  resetWizard = createEffect(() => this.actions$.pipe(
    ofType(bulkWizardActions.RESET_WIZARD),
    switchMap(() => {
      return [
        new SetValueAction(setupStepStore.FORM_ID, setupStepStore.INIT_DEFAULT_STATE),
        new ResetAction(setupStepStore.FORM_ID),
        new SetValueAction(shopsStepStore.FORM_ID, shopsStepStore.INIT_DEFAULT_STATE),
        new ResetAction(shopsStepStore.FORM_ID),
        new SetValueAction(attributesStepStore.FORM_ID, attributesStepStore.INIT_DEFAULT_STATE),
        new ResetAction(attributesStepStore.FORM_ID),
        new SetValueAction(registersAndReadingsStepStore.FORM_ID, registersAndReadingsStepStore.INIT_DEFAULT_STATE),
        new ResetAction(registersAndReadingsStepStore.FORM_ID)
      ];
    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<fromEquipment.State>,
    private meterService: MeterService,
    private locationService: LocationService
  ) {
  }

  updateDropdownData(dropdownData: any, item: setupStepStore.EquipmentTemplateFormValue, equipmentTemplates: MeterEquipmentViewModel[]) {
    if (!dropdownData[item.equipmentGroupId]) {
      dropdownData[item.equipmentGroupId] = equipmentTemplates.filter(t => t.equipmentGroup.id === item.equipmentGroupId).map(item => {
        return {
          id: item.id,
          name: item.equipmentModel
        };
      });
    }

    return dropdownData;
  }

  getSequenceNumberArray(locationGroupMeters: shopsStepStore.LocationGroupMetersFormValue[]) {
    let count = 0;

    return locationGroupMeters.reduce((acc, curr) => {
      curr.meters.forEach(m => {
        acc[m.serialNumber] = ++count;
      });
      return acc;
    }, {});
  }

  getAttributesStepForm(model: MeterWriteViewModel[], sequenceNumbers: any) {
    const groupDictionary = {};
    model.forEach(item => {
      if (groupDictionary[item.equipmentGroup.id]) {
        groupDictionary[item.equipmentGroup.id]['meters'].push(item);
        groupDictionary[item.equipmentGroup.id]['headers'] = groupDictionary[item.equipmentGroup.id]['headers']
          .concat(this.getSystemHeaderAttribute(item));
      } else {
        groupDictionary[item.equipmentGroup.id] = {};
        groupDictionary[item.equipmentGroup.id]['meters'] = [item];
        groupDictionary[item.equipmentGroup.id]['headers'] = this.getSystemHeaderAttribute(item);
      }
    });

    const equipmentGroupMeters = [];
    for (const key in groupDictionary) {
      const headerDictionary = {};
      const item = <attributesStepStore.EquipmentGroupMetersFormValue>{
        equipmentGroupId: key,
        headerAttributes: groupDictionary[key]['headers'].reduce((acc, curr) => {
          if (!headerDictionary[curr.id]) {
            acc.push(<attributesStepStore.HeaderAttribute>curr);
            headerDictionary[curr.id] = true;
          }
          return acc;
        }, []),
        meters: groupDictionary[key]['meters'].map(m => {
          return <attributesStepStore.MeterAttributesFormValue>{
            sequenceNumber: sequenceNumbers[m.serialNumber],
            serialNumber: m.serialNumber,
            locationName: m.location.location.name,
            locationId: m.location.location.id,
            equipmentGroupId: m.equipmentGroup.id,
            deviceId: m.equipmentTemplateId,
            deviceTypeName: m.deviceTypeName,
            supplyType: m.supplyType,
            isSelected: false,
            attributes: m.attributes.reduce((acc, curr) => {
              acc[curr.attribute.id] = curr;
              return acc;
            }, {})
          };
        })
      };

      equipmentGroupMeters.push(item);
    }

    return {equipmentGroupMeters: equipmentGroupMeters};
  }

  getSystemHeaderAttribute(meter: MeterWriteViewModel) {
    return meter.attributes.filter(attr => attr.attribute.isSystem && attr.attribute.name.toLocaleLowerCase() !== this.AMPERAGE_ATTRIBUTE)
      .map(attr => {
        return {
          id: attr.attribute.id,
          name: attr.attribute.name,
          fieldType: attr.attribute.fieldType
        };
      });
  }

  getRegistersAndReadingsStepForm(model: MeterWriteViewModel[], sequenceNumbers: any, activeBuildingPeriod: BuildingPeriodViewModel) {
    const date = new Date(activeBuildingPeriod.startDate);
    const meters = model.reduce((acc, curr) => {
      const item = <registersAndReadingsStepStore.MeterRegistersFormValue>{
        isSelected: false,
        locationName: curr.location.location.name,
        locationId: curr.location.location.id,
        equipmentGroupId: curr.equipmentGroup.id,
        deviceId: curr.equipmentTemplateId,
        deviceTypeName: curr.deviceTypeName,
        sequenceNumber: sequenceNumbers[curr.serialNumber],
        serialNumber: curr.serialNumber,
        equipmentTemplateId: curr.equipmentTemplateId,
        supplyType: curr.supplyType,
        registers: curr.registers.map(r => {
          return {
            ...r,
            description: '',
            useForBilling: true,
            date: date
          };
        })
      };

      acc.push(item);
      return acc;
    }, []);

    return {meters: meters};
  }

  getMetersFromTemplate(setupStepState: setupStepStore.State) {
    const setupStepFormValue = setupStepState.formState.value;
    const setupStepEquipmentGroup = setupStepState.equipmentGroups;
    const dropdownData = {};
    const supplies = setupStepState.supplies;
    const equipmentTemplates = setupStepState.equipmentTemplates;

    const locationGroups = setupStepFormValue.templates.reduce((locationGroupMeters, curr) => {
      const equipmentTemplate = equipmentTemplates.find(t => t.id === curr.deviceId);
      const suppliesTo = getSuppliesTo(supplies, equipmentTemplate.supplyType);

      let tempObj = updateDropdownData({}, [BulkDropdownType.Supplies, BulkDropdownType.SelectedSupplyTo],
        suppliesTo, curr.supplyToId ? curr.supplyToId : null);
      let meterArr = [];

      if (suppliesTo.length) {
        const supply = suppliesTo.find(s => s.id === curr.supplyToId) || suppliesTo[0];
        const supplyToLocations = supply && supply.supplyTypes.length ? supply.supplyTypes[0].supplyToLocations : [];
        tempObj = updateDropdownData(tempObj, [BulkDropdownType.LocationTypes, BulkDropdownType.SelectedLocationType],
          supplyToLocations, curr.locationType ? curr.locationType : null, 'name');
      }

      for (let i = 0; i < curr.numberOfEquipmentTemplate; i++) {
        meterArr = [...this.getMeters(setupStepEquipmentGroup, curr, equipmentTemplate)];
      }

      meterArr.forEach(m => dropdownData[m.id] = tempObj);

      const item = <LocationGroupMetersFormValue>{
        groupId: StringExtension.NewGuid(),
        locationId: curr.locationId,
        locationName: curr.locationType,
        meters: meterArr
      };

      locationGroupMeters.push(item);

      return locationGroupMeters;
    }, []);
    let meters = [];
    locationGroups.map(item => {
      return {
        ...item,
        meters: item.meters.map(m => {
          meters.push({...m, locationId: item.locationId});
          return {
            ...m,
          };
        })
      };
    });
    return {
      form: {locationGroupMeters: locationGroups, meters: meters},
      dropdownData: dropdownData
    };

  }

  compositMetersModel(state: {
                        bulkWizardState: bulkWizardStore.State,
                        setupStepState: setupStepStore.State,
                        shopsStepState: shopsStepStore.State,
                        attributesStepState: attributesStepStore.State,
                        registersAndReadingsStepState: registersAndReadingsStepStore.State
                      }, equipmentTemplates: EquipmentTemplateViewModel[], files: {},
                      unitOptions: any[], sequenceNumbers: any = null, buildingId: string): MeterWriteViewModel[] {
    const shopsStepFormValue = state.shopsStepState.formState.value;
    const attributesStepFormValue = state.attributesStepState.formState.value;
    const registersAndReadingsStepFormValue = state.registersAndReadingsStepState.formState.value;
    const locations = state.setupStepState.locations;
    const supplies = state.setupStepState.supplies;

    const equipments = shopsStepFormValue.locationGroupMeters.reduce((acc, group) => {
      const meters = group.meters.reduce((meters, item) => {
        const equipmentTemplate = equipmentTemplates.find(t => t.id === item.deviceId);
        let shopsFormItem = null;
        if (shopsStepFormValue.locationGroupMeters.length) {
          const locationGroup = shopsStepFormValue.locationGroupMeters.find(gm => gm.locationId === group.locationId);
          if (locationGroup) {
            shopsFormItem = locationGroup.meters.find(m => m.serialNumber === item.serialNumber);
          }
        }

        if (attributesStepFormValue.equipmentGroupMeters.length) {
          attributesStepFormValue.equipmentGroupMeters = attributesStepFormValue.equipmentGroupMeters.map(group => ({
            ...group,
            equipmentGroupId: equipmentTemplate.equipmentGroup.id
          }));
        }
        const registersAndReadingsFormItem = registersAndReadingsStepFormValue.meters.find(m => m.serialNumber === item.serialNumber);
        const suppliesTo = getSuppliesTo(supplies, equipmentTemplate.supplyType);
        const actualPhotoToFile = item.actualPhoto ? FileExtension.dataURLtoFile(item.actualPhoto, 'meter-image.png') : null;

        const attributesFormItem = attributesStepFormValue.equipmentGroupMeters.length ? attributesStepFormValue.equipmentGroupMeters
          .find(el => el.equipmentGroupId === equipmentTemplate.equipmentGroup.id)
          .meters.find(el => el.serialNumber === item.serialNumber) : null;

        const sourceMeter = {
          id: item.id,
          buildingId,
          serialNumber: item.serialNumber,
          supplyToId: item.supplyToId,
          actualPhoto: actualPhotoToFile,
          logoUrl: equipmentTemplate.logoUrl,
          manufactureDate: item.manufactureDate,
          equipmentTemplateId: equipmentTemplate.id,
          supplyType: equipmentTemplate.supplyType,
          equipmentGroup: equipmentTemplate.equipmentGroup,
          equipmentModel: equipmentTemplate.equipmentModel,
          deviceTypeName: item.deviceTypeName,
          location: {
            location: {
              id: group.locationId,
              name: locations.find(l => l.id === group.locationId).name
            },
            supplyDetail: shopsFormItem ? {
              id: shopsFormItem.supplyToId,
              name: suppliesTo.find(s => s.id === shopsFormItem.supplyToId)?.name,
              locationType: shopsFormItem.locationType
            } : null,
            description: shopsFormItem ? shopsFormItem.description : null
          },
          attributes: attributesFormItem ?
            Object.keys(attributesFormItem.attributes).map((key) => ({
              ...attributesFormItem.attributes[key],
              photo: attributesFormItem.attributes[key].photo && FileExtension.dataURLtoFile(attributesFormItem.attributes[key].photo, `attribute-image-${attributesFormItem.attributes[key].id}.png`) || null
            })) :
            equipmentTemplate.attributes.map(a => ({
              ...a,
              value: a.attribute.fieldType !== FieldType.Number ? a.value : null,
              numberValue: a.attribute.fieldType === FieldType.Number ? a.numberValue : null,
              photo: attributesFormItem && FileExtension.dataURLtoFile(attributesFormItem.attributes[a.attribute.id].photo, `attribute-image-${attributesFormItem.attributes[a.attribute.id].id}.png`) || null
            })),
          registers: registersAndReadingsFormItem ? registersAndReadingsFormItem.registers.map(r => {
            const register = {...r};
            const registerFile = files[item.serialNumber] ? files[item.serialNumber][register.id] : null;
            if (registerFile) {
              register.photo = FileExtension.dataURLtoFile(files[item.serialNumber][register.id].file, `register-${item.serialNumber}.png`);
            }

            register.sequenceNumber = registersAndReadingsFormItem.registers.indexOf(r);
            return register;
          }) : equipmentTemplate.registers,
          shopIds: shopsFormItem ? unbox(shopsFormItem.unitIds)
            .filter(id => unitOptions.find(o => o.unitType === UnitType.Shop && o.id === id)) : [],
          commonAreaIds: shopsFormItem ? unbox(shopsFormItem.unitIds)
            .filter(id => unitOptions.find(o => o.unitType === UnitType.CommonArea && o.id === id)) : [],
          parentMeters: shopsFormItem ? unbox(shopsFormItem.parentMeters) : []
        };

        meters.push(sourceMeter);

        return meters;
      }, []);

      acc = acc.concat(meters);

      return acc;
    }, []);

    if (sequenceNumbers) {
      equipments.sort((a, b) => sortFunc(sequenceNumbers[a.serialNumber], sequenceNumbers[b.serialNumber]));
    }

    return equipments;
  }

  getMeters(equipmentGroups: EquipmentGroupViewModel[],
            template: setupStepStore.EquipmentTemplateFormValue, equipmentTemplate: TemplateListItemViewModel) {
    return Array.apply(null, Array(template.numberOfEquipmentTemplate)).map((_) => {
      return <UnitMetersFormValue>{
        id: StringExtension.NewGuid(),
        equipmentGroupId: equipmentTemplate.equipmentGroupId,
        actualPhoto: template.photo,
        manufactureDate: template.manufactureDate,
        deviceId: equipmentTemplate.id,
        deviceTypeName: equipmentTemplate.brand + ': ' + equipmentTemplate.model,
        equipmentGroupName: equipmentGroups.find(g => g.id === template.equipmentGroupId).name,
        isSelected: false,
        supplyType: equipmentGroups.find(g => g.id === template.equipmentGroupId).supplyType,
        supplyToId: template.supplyToId,
        locationType: template.locationType,
        locationId: template.locationId,
        serialNumber: '',
        unitIds: box([]),
        unitName: '',
        description: null,
        parentMeters: box([]),
        descriptionField: ShopStepDescriptionFieldType.Units,
      };
    });
  }

  isExistSerialNumber(serialNumber: string, arrSeialNumbers: Array<string>) {
    return arrSeialNumbers.includes(serialNumber);
  }

  createMeter = (version: VersionViewModel<MeterWriteViewModel[]>, buildingId: string, actions: any[]) => {
    return this.meterService.createBulkMeter(buildingId, version).pipe(map(r => {
      return [...actions,
        new commonDataActions.GetHistoryWithVersionId(r.current.id),
        new bulkWizardActions.UpdateMetersId(r.entity)
      ];
    }), catchError(() => {
      return [...actions, {type: 'DUMMY'}];
    }));
  };

  // Try navigate to next step
  tryNavigateNextStep = createEffect(():Observable<any> => this.actions$.pipe(
    ofType(bulkWizardActions.TRY_NEXT_STEP),
    withLatestFrom(
      this.store$.pipe(select(bulkWizardSelectors.getStepStates)),
      this.store$.pipe(select(registersAndReadingsSelectors.getRegisterFiles)),
      this.store$.pipe(select(commonData.getSelectedHistoryLog)),
      this.store$.pipe(select(shopsSelectors.getUnitOptions)),
      this.store$.pipe(select(commonData.getIsComplete)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      this.store$.pipe(select(commonData.getActiveBuildingPeriod)),
      this.store$.pipe(select(commonData.getBuildingId)),
      (action: any, state: {
        bulkWizardState: bulkWizardStore.State,
        setupStepState: setupStepStore.State,
        shopsStepState: shopsStepStore.State,
        attributesStepState: attributesStepStore.State,
        registersAndReadingsStepState: registersAndReadingsStepStore.State
      }, files, selectedVersion, unitOptions, isComplete, versionId, activeBuildingPeriod, buildingId) => {
        return {
          step: action.payload,
          state,
          files,
          selectedVersion,
          unitOptions,
          isComplete,
          versionId,
          activeBuildingPeriod,
          buildingId
        };
      }),
    switchMap((storeParameters) => {
      switch (storeParameters.step) {
        case this.SECOND_STEP: {
          const parameters = {
            templateIds: storeParameters.state.setupStepState.formState.value.templates.map(t => t.deviceId)
          };

          return this.meterService.getEquipmentsById(storeParameters.buildingId, parameters).pipe(
            map(templates => {
              return {storeParameters, templates};
            })
          );
        }

        default: {
          const templates = storeParameters.state.registersAndReadingsStepState.equipmentTemplates;
          return of({storeParameters, templates});
        }
      }
    }),
    switchMap(({storeParameters, templates}) => {
      const {
        state,
        step,
        files,
        selectedVersion,
        unitOptions,
        isComplete,
        versionId,
        activeBuildingPeriod,
        buildingId
      } = storeParameters;
      let actions = [];
      const actionType = isComplete ? state.bulkWizardState.actionType : VersionActionType.Init;

      let date = null;
      if (actionType === VersionActionType.Insert) {
        date = state.bulkWizardState.versionDate;
      } else if (selectedVersion) {
        date = selectedVersion.startDate;
      }
      switch (step) {
        case this.FIRST_STEP: {
          actions.push(new MarkAsSubmittedAction(setupStepStore.FORM_ID));
          if (state.setupStepState.formState.isValid) {
            const result = this.getMetersFromTemplate(state.setupStepState);
            actions = [...actions,
              new shopsStepActions.InitShopsAndCommonAreas(),
              new SetValueAction(shopsStepStore.FORM_ID, result.form),
              new shopsStepActions.SetDropdownData(result.dropdownData),
              new bulkWizardActions.GoToStep(step)
            ];
          }
          break;
        }

        case this.SECOND_STEP: {
          actions.push(new MarkAsSubmittedAction(shopsStepStore.FORM_ID));
          if (state.shopsStepState.formState.isValid) {
            const sequenceNumbers = this.getSequenceNumberArray(state.shopsStepState.formState.value.locationGroupMeters);
            const form = this.getAttributesStepForm(
              this.compositMetersModel(state, templates, files, unitOptions, null, buildingId), sequenceNumbers);
            actions = [...actions,
              new registersAndReadingsStepActions.SetEquipmentTemplates(templates),
              new SetValueAction(attributesStepStore.FORM_ID, form),
              new bulkWizardActions.GoToStep(step)
            ];
          }
          break;
        }

        case this.THIRD_STEP: {
          actions.push(new MarkAsSubmittedAction(registersAndReadingsStepStore.FORM_ID));
          if (state.attributesStepState.formState.isValid) {
            const sequenceNumbers = this.getSequenceNumberArray(state.shopsStepState.formState.value.locationGroupMeters);
            const form = this.getRegistersAndReadingsStepForm(
              this.compositMetersModel(state, templates, files, unitOptions, null, buildingId), sequenceNumbers, activeBuildingPeriod);
            actions = [...actions,
              new SetValueAction(registersAndReadingsStepStore.FORM_ID, registersAndReadingsStepStore.INIT_DEFAULT_STATE),
              new SetValueAction(registersAndReadingsStepStore.FORM_ID, form),
              new bulkWizardActions.GoToStep(step)
            ];
          }

          break;
        }

        case this.CLOSE_WIZARD: {
          const sequenceNumbers = this.getSequenceNumberArray(state.shopsStepState.formState.value.locationGroupMeters);
          const model = this.compositMetersModel(state, templates, files, unitOptions, sequenceNumbers, buildingId);
          const version: VersionViewModel<MeterWriteViewModel[]> = new VersionViewModel(model, state.bulkWizardState.comment,
            actionType, date, versionId);
          actions.push(new bulkWizardActions.ToggleWizard());
          return this.createMeter(version, buildingId, actions);
        }

        default:
          throw new Error('Unknown step');
      }

      return of(actions);
    }),
    switchMap((actions) => {

      return actions;
    })
  ));
}

