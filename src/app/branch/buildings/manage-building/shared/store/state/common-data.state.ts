import {EquipmentAttributeViewModel, HistoryViewModel, RegisterViewModel, UnitOfMeasurement,} from '@models';
import {BuildingPeriodViewModel} from '../../models/building-period.model';

export interface State {
  buildingId: string;
  history: HistoryViewModel[];
  versionId: string;
  isComplete: boolean;
  disableChangeVersion: boolean;
  attributes: EquipmentAttributeViewModel[];
  registers: RegisterViewModel[];
  unitsOfMeasurement: UnitOfMeasurement[];
  redirectUrl: string;
  activeBuildingPeriod: BuildingPeriodViewModel;
  isFinalized: boolean;
}
