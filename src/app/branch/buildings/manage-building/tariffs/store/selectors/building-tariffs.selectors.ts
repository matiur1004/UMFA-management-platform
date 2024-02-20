import {createFeatureSelector, createSelector} from '@ngrx/store';
import {State} from '../reducers';
import {FieldType} from '@models';
import {getTariffVersionsSelectors} from 'app/shared/tariffs/store/selectors/tariff-versions.selectors';


const _getState = createFeatureSelector<State>('building-tariffs');

export const getBuildingId = createSelector(
  _getState,
  state => state.buildingId
);

export const getTariffState = createSelector(
  _getState,
  state => state.tariff
);

export const getTariffSettings = createSelector(
  _getState,
  state => state.tariffSettings
);

export const getTariffFormState = createSelector(
  _getState,
  state => state.tariffForm
);

export const getTariffValueFormState = createSelector(
  _getState,
  state => state.tariffValueForm
);

export const getTariffValuesState = createSelector(
  _getState,
  state => state.tariffValues
);

export const getTariffVersionsState = createSelector(
  _getState,
  state => state.tariffVersions
);

export const getBuildingCategories = createSelector(
  _getState,
  state => state.buildingCategories
);

export const getTariffCategoriesState = createSelector(
  _getState,
  state => state.tariffCategoriesForm
);

export const getTariffStepsState = createSelector(
  _getState,
  state => state.stepsForm
);

export const getRegisters = createSelector(
  _getState,
  state => state.registers
);

export const getAttributes = createSelector(
  _getState,
  state => state.attributes
);

export const getSystemAttributes = createSelector(
  getAttributes,
  attributes => attributes.filter(a => a.isSystem)
);

export const getAttributesComboValues = createSelector(
  getAttributes,
  attributes =>
    (attributes || [])
      .filter(a => a.fieldType === FieldType.Combo)
      .reduce((agg, curr) => {
        agg[curr.id] = curr.comboSettings;
        return agg;
      }, {})
);

export const getAllocatedTariffsState = createSelector(
  _getState,
  (state: State) => state.allocatedTariffs
);

export const getAddNewTariffBuilding = createSelector(
  _getState,
  (state: State) => state.addNewTariffBuilding
);

export const getAdditionalCharges = createSelector(
  _getState,
  (state: State) => state.additionalCharges
);

export const getEditChargeVersion = createSelector(
  _getState,
  (state: State) => state.editChargeVersion
);

export const getAddChargeLineItem = createSelector(
  _getState,
  (state: State) => state.addChargeLineItem
);

export const getEditChargeValue = createSelector(
  _getState,
  (state: State) => state.editChargeValue
);

export const getAddNewCharge = createSelector(
  _getState,
  (state: State) => state.addNewCharge
);

export const getAddNewChargeValue = createSelector(
  _getState,
  (state: State) => state.addNewChargeValue
);

export const getCostProviderNodes = createSelector(
  _getState,
  (state: State) => state.costProviderNodes
);

const tariffVersionSelectors = getTariffVersionsSelectors(getTariffVersionsState);

export const getTariffVersionsSorted = tariffVersionSelectors.getTariffVersionsSorted;
export const getTariffSubVersionsSorted = tariffVersionSelectors.getTariffSubVersionsSorted;
export const getPreviousSubVersion = tariffVersionSelectors.getPreviousSubVersion;
export const getTariffVersionsOrder = tariffVersionSelectors.getTariffVersionsOrder;
export const getTariffSubVersionsOrder = tariffVersionSelectors.getTariffSubVersionsOrder;
export const getTariffValuesOrder = tariffVersionSelectors.getTariffValuesOrder;
export const getTariffValuesSorted = tariffVersionSelectors.getTariffValuesSorted;
export const getTariffFormMaxMajorVersion = createSelector(
  getTariffVersionsSorted,
  getTariffFormState,
  (versions, formState) => Math.max(...versions.map(v => v.majorVersion), formState.formState.value.majorVersion)
);

export const getTariffFormMaxMinorVersion = createSelector(
  getTariffSubVersionsSorted,
  getTariffFormState,
  (subVersions, formState) => {
    return Math.max(...subVersions.map(v => v.minorVersion), formState.formState.value.minorVersion);
  }
);

export const getTariffVersionSettings = createSelector(
  _getState,
  state => state.tariffVersionSettings
);
