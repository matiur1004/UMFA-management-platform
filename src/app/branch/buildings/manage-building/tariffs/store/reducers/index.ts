import {ActionReducer, combineReducers, MetaReducer} from '@ngrx/store';
import * as steps from 'app/shared/tariffs/store/reducers/tariff-steps.store';
import * as tariffCategories from 'app/shared/tariffs/store/reducers/tariff-categories.store';
import * as attributesStore from './attributes.reducer';
import * as buildingCategoriesStore from './building-categories.reducer';
import * as registersStore from './registers.reducer';
import * as tariff from './tariff.reducer';
import * as tariffSettings from './tariff-settings.reducer';
import * as tariffVersionSettings from 'app/shared/tariffs/store/reducers/tariff-version-settings.reducer';
import * as bldTariffsActions from '../actions/building-tariffs.actions';
import * as tariffValuesActions from '../actions/tariff-values.actions';
import * as fromAllocatedTariffsReducers from './allocated-tariffs.reducer';
import * as fromAddNewTariffBuilding from './add-new-tariff-building.reducer';
import * as fromAdditionalCharges from './additional-charges.reducer';
import * as fromEditChargeVersion from './edit-charge-version.reducer';
import * as fromAddChargeLineItem from './add-charge-line-item.store';
import * as fromEditChargeValue from './edit-charge-value.reducer';
import * as fromAddNewCharge from './add-new-charge.store';
import * as fromAddNewChargeValue from './add-new-charge-value.store';
import * as tariffForm from 'app/shared/tariffs/store/reducers/tariff-form.store';
import * as tariffVersions from 'app/shared/tariffs/store/reducers/tariff-versions.store';
import * as tariffValueForm from 'app/shared/tariffs/store/reducers/tariff-values-form.store';
import * as tariffValues from '../reducers/tariff-values.store';
import * as costProviderNodesStore from './cost-provider-nodes.store';

import {CategoryViewModel, EquipmentAttributeViewModel, RegisterViewModel} from '@models';

export const featureName = 'building-tariffs';

export interface State {
  buildingId: string;
  tariffCategoriesForm: tariffCategories.State;
  stepsForm: steps.State;
  attributes: EquipmentAttributeViewModel[];
  registers: RegisterViewModel[];
  buildingCategories: CategoryViewModel[];
  tariff: tariff.State;
  tariffSettings: tariffSettings.State;
  tariffVersionSettings: tariffVersionSettings.State;
  tariffForm: tariffForm.State;
  tariffVersions: tariffVersions.State;
  tariffValues: tariffValues.State;
  tariffValueForm: tariffValueForm.State;

  allocatedTariffs: fromAllocatedTariffsReducers.State;
  addNewTariffBuilding: fromAddNewTariffBuilding.State;

  additionalCharges: fromAdditionalCharges.State;
  editChargeVersion: fromEditChargeVersion.State;
  addChargeLineItem: fromAddChargeLineItem.State;
  editChargeValue: fromEditChargeValue.State;
  addNewCharge: fromAddNewCharge.State;
  addNewChargeValue: fromAddNewChargeValue.State;

  costProviderNodes: any;
}

export const buildingTariffStepsFormId = 'building-tariff-steps-form';
export const buildingTariffCategoriesFormId = 'building-tariff-categories-form';
export const buildingTariffFormId = 'building-tariff-form';
export const buildingTariffValuesFormId = 'building-tariff-values-form';
export const buildingTariffAreaName = 'building-tariff';

export const buildingIdReducer = (state: string = null, a: bldTariffsActions.Action): string => {
  switch (a.type) {
    case bldTariffsActions.UPDATE_BUILDING_ID:
      return a.payload.buildingId;
    default:
      return state;
  }
};
const baseTariffVersionsReducer = tariffVersions.getReducer(buildingTariffAreaName);
const tariffVersionsReducer = (state: tariffVersions.State, action: any) => {
  if (action.type === tariffValuesActions.DELETE_TARIFF_VALUES_VERSION_REQUEST_COMPLETE) {
    const newTariffValueVersions = state.tariffValuesVersions.filter(v => v.versionId !== action.payload.valueVersionId);

    if (newTariffValueVersions.length) {
      const maxVersion = Math.max(...newTariffValueVersions.map(item => item.minorVersion));

      const newActualVersion = newTariffValueVersions.find(item => item.minorVersion === maxVersion);
      newActualVersion.isActual = true;
    }

    return {
      ...state,
      tariffValuesVersions: newTariffValueVersions
    };
  }

  if (action.type === tariffValuesActions.DELETE_TARIFF_VALUE_REQUEST_COMPLETE) {
    return {
      ...state,
      tariffValuesVersions: state.tariffValuesVersions.filter(v => v.valueId !== action.payload.tariffValueId)
    };
  }

  return baseTariffVersionsReducer(state, action);
};


export const reducers = combineReducers<State, any>({
  buildingId: buildingIdReducer,
  tariffCategoriesForm: tariffCategories.getReducer(buildingTariffCategoriesFormId),
  stepsForm: steps.getReducer(buildingTariffStepsFormId),
  attributes: attributesStore.reducer,
  registers: registersStore.reducer,
  tariff: tariff.reducer,
  tariffSettings: tariffSettings.reducer,
  tariffVersionSettings: tariffVersionSettings.reducer,
  tariffVersions: tariffVersionsReducer,
  tariffForm: tariffForm.getReducer(buildingTariffFormId),
  tariffValues: tariffValues.reducer,
  tariffValueForm: tariffValueForm.getReducer(buildingTariffValuesFormId),
  buildingCategories: buildingCategoriesStore.reducer,
  allocatedTariffs: fromAllocatedTariffsReducers.reducer,
  addNewTariffBuilding: fromAddNewTariffBuilding.reducer,
  additionalCharges: fromAdditionalCharges.reducer,
  editChargeVersion: fromEditChargeVersion.reducer,
  addChargeLineItem: fromAddChargeLineItem.reducer,
  editChargeValue: fromEditChargeValue.reducer,
  addNewCharge: fromAddNewCharge.reducer,
  addNewChargeValue: fromAddNewChargeValue.reducer,
  costProviderNodes: costProviderNodesStore.reducer,
});

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = [logger];

