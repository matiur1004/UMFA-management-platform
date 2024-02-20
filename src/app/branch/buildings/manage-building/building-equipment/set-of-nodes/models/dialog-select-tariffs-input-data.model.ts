import {TariffViewModel, VersionViewModel} from "@models";

export interface DialogSelectTariffsInputDataModel {
  tariffs: VersionViewModel<TariffViewModel>[];
}
