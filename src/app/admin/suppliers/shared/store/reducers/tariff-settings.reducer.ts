import * as bldTariffsActions from '../actions/supplier-common.actions';
import {TariffCategoryViewModel, TariffStepModel} from '@models';
import {getSortedSteps} from '@shared-helpers';

export interface State {
  categoriesEnabled: boolean;
  tariffCategories: TariffCategoryViewModel[];
  stepsEnabled: boolean;
  tariffSteps: TariffStepModel[];
  supplierId: string;
}

export const reducer = (state: State = null, a: bldTariffsActions.Action): State => {
  switch (a.type) {
    case bldTariffsActions.API_SUPPLIER_TARIFF_SETTINGS_REQUEST_SUCCEEDED:
      const {categoriesEnabled, tariffCategories, stepsEnabled, tariffSteps, supplierId} = a.payload;
      return {
        categoriesEnabled: categoriesEnabled,
        tariffCategories: tariffCategories,
        stepsEnabled: stepsEnabled,
        tariffSteps: getSortedSteps(tariffSteps),
        supplierId: supplierId
      };
    case bldTariffsActions.CLEAR_TARIFF_SETTINGS_STORE:
      return {
        categoriesEnabled: null,
        tariffCategories: [],
        stepsEnabled: false,
        tariffSteps: [],
        supplierId: null
      };
    default:
      return state;
  }
};
