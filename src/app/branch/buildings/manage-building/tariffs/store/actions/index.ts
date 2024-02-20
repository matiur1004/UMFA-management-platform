import {AllocatedBuildingTariffsActions} from './allocated-tariffs.actions';
import {AddNewTariffBuildingActions} from './add-new-tariff-building.actions';
import {BuildingAdditionalChargesActions} from './additional-charges.actions';
import {EditChargeVersionActions} from './edit-charge-version.actions';
import {AddChargeLineItemActions} from './add-charge-line-item.actions';
import {EditChargeValueActions} from './edit-charge-value.actions';
import {AddNewChargeActions} from './add-new-charge.actions';
import {AddNewChargeValueActions} from './add-new-charge-value.actions';

export type Actions =
  | AllocatedBuildingTariffsActions
  | AddNewTariffBuildingActions
  | BuildingAdditionalChargesActions
  | EditChargeVersionActions
  | AddChargeLineItemActions
  | EditChargeValueActions
  | AddNewChargeActions
  | AddNewChargeValueActions;

export * from './allocated-tariffs.actions';
export * from './add-new-tariff-building.actions';
export * from './additional-charges.actions';
export * from './edit-charge-version.actions';
export * from './add-charge-line-item.actions';
export * from './edit-charge-value.actions';
export * from './add-new-charge.actions';
export * from './add-new-charge-value.actions';
export * from './tariff-settings.actions';
