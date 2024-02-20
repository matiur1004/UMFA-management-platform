import {TariffVersionSettingsViewModel} from "@app/shared/models/tariff-version-settings.model";
import {Action as StoreAction} from '@ngrx/store';
import {TariffCategoryAllocatedUnitViewModel} from "../../models/tariff-category-allocated-unit.model";

export const SET_TARIFF_VERSION_SETTINGS = '[Tariff Version Settings] SET_TARIFF_VERSION_SETTINGS';
export const SAVE_TARIFF_VERSION_SETTINGS = '[Tariff Version Settings] SAVE_TARIFF_VERSION_SETTINGS';

export const GET_TARIFF_CATEGORIES_ALLOCATED_UNITS = '[Tariff Version Settings] GET_TARIFF_CATEGORIES_ALLOCATED_UNITS';
export const GET_TARIFF_CATEGORIES_ALLOCATED_UNITS_SUCCESS = '[Tariff Version Settings] GET_TARIFF_CATEGORIES_ALLOCATED_UNITS_SUCCESS';

export const TARIFF_CATEGORIES_ALLOCATED_CLOSE_DIALOG = '[Tariff Version Settings] TARIFF_CATEGORIES_ALLOCATED_CLOSE_DIALOG';
export const TARIFF_CATEGORIES_ALLOCATED_DISMISS_DIALOG = '[Tariff Version Settings] TARIFF_CATEGORIES_ALLOCATED_DISMISS_DIALOG';

export class SetTariffVersionSettings implements StoreAction {
  readonly type = SET_TARIFF_VERSION_SETTINGS;

  constructor(public payload: TariffVersionSettingsViewModel) {
  }
}

export class SaveTariffVersionSettings implements StoreAction {
  readonly type = SAVE_TARIFF_VERSION_SETTINGS;

  constructor(public payload: { tariffVersionId: string, buildingId?: string }) {
  }
}

export class GetTariffCategoriesAllocatedUnits implements StoreAction {
  readonly type = GET_TARIFF_CATEGORIES_ALLOCATED_UNITS;

  constructor(public payload: {
    tariffVersionId: string,
    tariffCategoryIds: string[],
    categoryFormId: string,
    stepFormId: string,
    saveAction: StoreAction
  }) {
  }
}

export class GetTariffCategoriesAllocatedUnitsSuccess implements StoreAction {
  readonly type = GET_TARIFF_CATEGORIES_ALLOCATED_UNITS_SUCCESS;

  constructor(public payload: {
    allocatedUnits: TariffCategoryAllocatedUnitViewModel[],
    categoryFormId: string,
    stepFormId: string,
    saveAction: StoreAction
  }) {
  }
}

export class CloseDialog implements StoreAction {
  readonly type = TARIFF_CATEGORIES_ALLOCATED_CLOSE_DIALOG;
}

export class DismissDialog implements StoreAction {
  readonly type = TARIFF_CATEGORIES_ALLOCATED_DISMISS_DIALOG;
}

export type Action = SetTariffVersionSettings
  | GetTariffCategoriesAllocatedUnits
  | GetTariffCategoriesAllocatedUnitsSuccess
  | CloseDialog
  | DismissDialog;
