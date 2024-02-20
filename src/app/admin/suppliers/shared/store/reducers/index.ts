import {ActionReducer, combineReducers, MetaReducer} from '@ngrx/store';
import * as supplierInfoForm from './supplier-info-form.store';
import * as tariffForm from 'app/shared/tariffs/store/reducers/tariff-form.store';
import * as tariff from './tariff.store';
import * as createSupplierForm from './create-supplier-form.store';
import * as attributesStore from './attributes.reducer';
import * as registersStore from './registers.reducer';
import * as buildingCategoriesStore from './building-categories.reducer';
import * as fromCommonData from './supplier-common.store';
import * as tariffValuesActions from '../actions/tariff-values.actions';
import * as steps from 'app/shared/tariffs/store/reducers/tariff-steps.store';
import * as tariffCategories from 'app/shared/tariffs/store/reducers/tariff-categories.store';
import * as fromTariffValues from './tariff-values.store';
import * as fromSupplier from './supplier.store';
import * as tariffSettings from './tariff-settings.reducer';
import * as tariffVersionSettings from 'app/shared/tariffs/store/reducers/tariff-version-settings.reducer';
import {CategoryViewModel, EquipmentAttributeViewModel, RegisterViewModel} from '@models';
import * as tariffVersions from 'app/shared/tariffs/store/reducers/tariff-versions.store';
import * as tariffValueForm from 'app/shared/tariffs/store/reducers/tariff-values-form.store';

export const SupplierStepsFormId = 'supplier-tariff-steps';
export const SupplierCategoriesFormId = 'supplier-tariff-categories';
export const SupplierTariffFormId = 'supplier-tariff-form';
export const SupplierTariffValuesFormId = 'supplier-tariff-values-form';
export const SupplierTariffAreaName = 'supplier-tariff-form';

export interface State {
  supplierInfoForm: supplierInfoForm.State;
  tariffForm: tariffForm.State;
  tariff: tariff.State;
  createSupplierForm: createSupplierForm.State;
  commonData: fromCommonData.State;
  tariffSettings: tariffSettings.State;
  tariffCategories: tariffCategories.State;
  tariffVersions: tariffVersions.State;
  steps: steps.State;
  attributes: EquipmentAttributeViewModel[];
  registers: RegisterViewModel[];
  buildingCategories: CategoryViewModel[];
  supplier: fromSupplier.State;
  tariffValues: fromTariffValues.State;
  tariffValuesForm: tariffValueForm.State;
  tariffVersionSettings: tariffVersionSettings.State;
}

const baseTariffVersionsReducer = tariffVersions.getReducer(SupplierTariffAreaName);
const tariffVersionsReducer = (state: tariffVersions.State, action: any) => {
  if (action.type === tariffValuesActions.DELETE_TARIFF_VALUES_VERSION_REQUEST_COMPLETE) {
    const newTariffValueVersions = state.tariffValuesVersions.filter(v => v.versionId !== action.payload.tariffValueVersionId);

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
  supplierInfoForm: supplierInfoForm.reducer,
  tariffForm: tariffForm.getReducer(SupplierTariffFormId),
  tariff: tariff.reducer,
  supplier: fromSupplier.reducer,
  tariffSettings: tariffSettings.reducer,
  tariffCategories: tariffCategories.getReducer(SupplierCategoriesFormId),
  tariffVersions: tariffVersionsReducer,
  steps: steps.getReducer(SupplierStepsFormId),
  attributes: attributesStore.reducer,
  registers: registersStore.reducer,
  buildingCategories: buildingCategoriesStore.reducer,
  commonData: fromCommonData.reducer,
  createSupplierForm: createSupplierForm.reducer,
  tariffValues: fromTariffValues.reducer,
  tariffValuesForm: tariffValueForm.getReducer(SupplierTariffValuesFormId),
  tariffVersionSettings: tariffVersionSettings.reducer,
});

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = [logger];
