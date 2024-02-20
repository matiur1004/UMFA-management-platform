import * as bldTariffsActions from '../actions/building-tariffs.actions';
import {TariffCategoryViewModel, TariffStepModel} from '@models';
import {getSortedSteps} from '@shared-helpers';

export interface State {
  categoriesEnabled: boolean;
  tariffCategories: TariffCategoryViewModel[];
  stepsEnabled: boolean;
  tariffSteps: TariffStepModel[];
  buildingId: string;
}

export const reducer = (state: State = null, a: bldTariffsActions.Action): State => {
  switch (a.type) {
    case bldTariffsActions.API_BUILDING_TARIFF_SETTINGS_REQUEST_SUCCEEDED:
      const {categoriesEnabled, tariffCategories, stepsEnabled, tariffSteps, buildingId} = a.payload;
      return {
        categoriesEnabled: categoriesEnabled,
        tariffCategories: tariffCategories,
        stepsEnabled: stepsEnabled,
        tariffSteps: getSortedSteps(tariffSteps),
        buildingId: buildingId
      };
    default:
      return state;
  }
};
