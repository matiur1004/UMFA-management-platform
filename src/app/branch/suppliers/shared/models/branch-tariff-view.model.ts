import {BuildingViewModel} from './building-view.model';
import {TariffViewModel} from '@models';

export interface BranchTariffViewModel extends TariffViewModel {
  buildings: BuildingViewModel[];
}

