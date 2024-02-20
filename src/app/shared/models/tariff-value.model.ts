import {Action as StoreAction} from '@ngrx/store';

import {TariffCategoryViewModel} from './tariff-category.model';
import {TariffStepModel} from './tariff-step.model';
import {TariffValueVersionInfoViewModel} from "./tariff.model";
import {TimeOfUse} from './time-of-use.model';
import {UserViewModel} from './user.model';

export enum Season {
  High,
  Low,
}

export interface TariffLineItemValueHistoryViewModel {
  tariffValueName: string;
  value: number;
}

export interface TariffValuesViewModel {
  id: string;
  name: string;
  increase: number;
  tariffVersionId: string;
  tariffName: string;
  tariffVersion: string;
  startDate: string;
  endDate: string;
  lineItemValues: TariffLineItemValuesViewModel[];
  versions: TariffValueVersionInfoViewModel[];
}

export interface TariffLineItemValuesViewModel {
  lineItemId: string;
  lineItemName: string;
  chargingMethod: string;
  seasons: Season[];
  categories: TariffCategoryViewModel;
  timeOfUses: TimeOfUse[];
  values: TariffLineItemValueViewModel[];
  stepSchema?: TariffStepModel;
}

export interface TariffLineItemValueViewModel {
  seasonType: Season;
  timeOfUses: TimeOfUse;
  tariffCategoryId: string;
  value: number;
  history: TariffLineItemValueHistoryViewModel[];
  previousValue: number;
  stepRangeId: string;
}

export interface TariffValueInfoViewModel {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  createdOn: Date;
  updatedOn: Date;
  createdByUser: UserViewModel;
  updatedByUser: UserViewModel;
}

export class TariffValueVersionModel {
  isNewVersion: boolean;
  postUpdateActions: StoreAction[] = [];
}
