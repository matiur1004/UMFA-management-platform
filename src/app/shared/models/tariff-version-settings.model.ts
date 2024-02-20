import {TariffVersionCategoryViewModel} from ".";
import {TariffVersionStepModel} from "./tariff-step.model";

export class TariffVersionSettingsViewModel {
  public categoriesEnabled: boolean;
  public tariffCategories: TariffVersionCategoryViewModel[] = [];

  public stepsEnabled: boolean;
  public tariffSteps: TariffVersionStepModel[] = [];
}
