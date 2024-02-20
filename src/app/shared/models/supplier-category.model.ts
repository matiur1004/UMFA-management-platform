import {TariffStepModel} from './tariff-step.model';
import {TariffCategoryViewModel} from './tariff-category.model';

export interface SupplierTariffCategoriesViewModel {
  categoriesEnabled: boolean;
  stepsEnabled: boolean;
  tariffCategories: TariffCategoryViewModel[];
  tariffSteps: TariffStepModel[];
}
