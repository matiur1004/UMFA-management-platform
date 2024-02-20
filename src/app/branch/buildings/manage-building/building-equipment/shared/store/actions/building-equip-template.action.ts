import {Action as StoreAction} from '@ngrx/store';
import {
  BrandViewModel,
  EquipmentGroupViewModel,
  EquipmentTemplateListItemViewModel,
  PagingViewModel
} from '@app/shared/models';
import {BuildingPackageDetailViewModel} from '@app/branch/buildings/building-services/shared/models';

export const REQUEST_EQUIPMENT_TEMPLATE_LIST = '[Building Equipment Template] REQUEST_EQUIPMENT_TEMPLATE_LIST';
export const REQUEST_EQUIPMENT_TEMPLATE_COMPLETE = '[Building Equipment Template] REQUEST_EQUIPMENT_TEMPLATE_COMPLETE';
export const ADD_EQUIPMENT_TEMPLATE = '[Building Equipment Template] ADD_EQUIPMENT_TEMPLATE';
export const REMOVE_EQUIPMENT_TEMPLATE = '[Building Equipment Template] REMOVE_EQUIPMENT_TEMPLATE';
export const UPDATE_ORDER = '[Building Equipment Template] UPDATE_ORDER';
export const UPDATE_SEARCH_KEY = '[Building Equipment Template] UPDATE_SEARCH_KEY';
export const UPDATE_UNITS_PER_PAGE = '[Building Equipment Template] UPDATE_UNITS_PER_PAGE';
export const UPDATE_PAGE = '[Building Equipment Template] UPDATE_PAGE';
export const UPDATE_IS_ASSIGNED_FILTER = '[Building Equipment Template] UPDATE_IS_ASSIGNED_FILTER';

export const INIT_FILTER_DATA = '[Building Equipment Template] INIT_FILTER_DATA';
export const INIT_FILTER_DATA_COMPLETE = '[Building Equipment Template] INIT_FILTER_DATA_COMPLETE';
export const UPDATE_FILTER = '[Building Equipment Template] UPDATE_FILTER';
export const UPDATE_FILTER_COMPLETE = '[Building Equipment Template] UPDATE_FILTER_COMPLETE';
export const INIT_FILTER_DETAIL = '[Building Equipment Template] INIT_FILTER_DETAIL';
export const RESET_FILTER = '[Building Equipment Template] RESET_FILTER';
export const RESET_FORM = '[Building Equipment Template] RESET_FORM';


export const UPDATE_SUPPLY_TYPE = '[Building Equipment Template] UPDATE_SUPPLY_TYPE';
export const UPDATE_ALL_SUPPLY_TYPES = '[Building Equipment Template] UPDATE_ALL_SUPPLY_TYPES';
export const UPDATE_EQUIPMENT_GROUP = '[Building Equipment Template] UPDATE_EQUIPMENT_GROUP';
export const UPDATE_BRAND = '[Building Equipment Template] UPDATE_BRAND';
export const UPDATE_MODEL = '[Building Equipment Template] UPDATE_MODEL';
export const UPDATE_ATTRIBUTE = '[Building Equipment Template] UPDATE_ATTRIBUTE';
export const UPDATE_IS_OLD_MODEL = '[Building Equipment Template] UPDATE_IS_OLD_MODEL';

export class RequestEquipmentTemplateList implements StoreAction {
  readonly type = REQUEST_EQUIPMENT_TEMPLATE_LIST;

  constructor() {
  }
}

export class RequestEquipmentTemplateListComplete implements StoreAction {
  readonly type = REQUEST_EQUIPMENT_TEMPLATE_COMPLETE;

  constructor(public payload: PagingViewModel<EquipmentTemplateListItemViewModel>) {
  }
}

export class AddEquipmentTemplate implements StoreAction {
  readonly type = ADD_EQUIPMENT_TEMPLATE;

  constructor(public payload: string) {
  }
}

export class RemoveEquipmentTemplate implements StoreAction {
  readonly type = REMOVE_EQUIPMENT_TEMPLATE;

  constructor(public payload: string) {
  }
}

export class UpdateSearchKey implements StoreAction {
  readonly type = UPDATE_SEARCH_KEY;

  constructor(public payload: string) {
  }
}

export class UpdateOrder implements StoreAction {
  readonly type = UPDATE_ORDER;

  constructor(public payload: number) {
  }
}

export class UpdateUnitsPerPage implements StoreAction {
  readonly type = UPDATE_UNITS_PER_PAGE;

  constructor(public payload: number) {
  }
}

export class UpdatePage implements StoreAction {
  readonly type = UPDATE_PAGE;

  constructor(public payload: number) {
  }
}

export class UpdateIsAssignedFilter implements StoreAction {
  readonly type = UPDATE_IS_ASSIGNED_FILTER;

  constructor(public payload: number) {
  }
}

export class InitFilterData implements StoreAction {
  readonly type = INIT_FILTER_DATA;

  constructor() {
  }
}

export class InitFilterDataComplete implements StoreAction {
  readonly type = INIT_FILTER_DATA_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateFilter implements StoreAction {
  readonly type = UPDATE_FILTER;

  constructor() {
  }
}

export class InitFilterDetail implements StoreAction {
  readonly type = INIT_FILTER_DETAIL;

  constructor(public payload: BuildingPackageDetailViewModel) {
  }
}

export class UpdateSupplyType implements StoreAction {
  readonly type = UPDATE_SUPPLY_TYPE;

  constructor(public payload: { isChecked: boolean, idx: number }) {
  }
}

export class UpdateAllSupplyTypes implements StoreAction {
  readonly type = UPDATE_ALL_SUPPLY_TYPES;

  constructor() {
  }
}

export class UpdateBrand implements StoreAction {
  readonly type = UPDATE_BRAND;

  constructor(public payload: BrandViewModel) {
  }
}

export class UpdateEquipmentGroup implements StoreAction {
  readonly type = UPDATE_EQUIPMENT_GROUP;

  constructor(public payload: EquipmentGroupViewModel) {
  }
}

export class UpdateAttribute implements StoreAction {
  readonly type = UPDATE_ATTRIBUTE;

  constructor(public payload) {
  }
}

export class UpdateModel implements StoreAction {
  readonly type = UPDATE_MODEL;

  constructor(public payload: string) {
  }
}

export class UpdateIsOldModel implements StoreAction {
  readonly type = UPDATE_IS_OLD_MODEL;

  constructor() {
  }
}

export class UpdateFilterComplete implements StoreAction {
  readonly type = UPDATE_FILTER_COMPLETE;

  constructor(public payload) {
  }
}

export class ResetFilter implements StoreAction {
  readonly type = RESET_FILTER;

  constructor() {
  }
}

export class ResetForm implements StoreAction {
  readonly type = RESET_FORM;

  constructor() {
  }
}


export type Action = RequestEquipmentTemplateList | RequestEquipmentTemplateListComplete |
  AddEquipmentTemplate | RemoveEquipmentTemplate | UpdateSearchKey |
  UpdateOrder | UpdatePage | UpdateUnitsPerPage | UpdateIsAssignedFilter |
  InitFilterData | InitFilterDataComplete | UpdateFilter | InitFilterDetail |
  UpdateAllSupplyTypes | UpdateSupplyType | UpdateBrand | UpdateEquipmentGroup |
  UpdateAttribute | UpdateModel | UpdateIsOldModel | UpdateFilterComplete | ResetFilter |
  ResetForm;
