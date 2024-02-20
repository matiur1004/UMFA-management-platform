import {Action as StoreAction} from '@ngrx/store';
import {
  EquipmentAttributeViewModel,
  LogicalOperators,
  TariffCategoryRuleViewModel,
  TariffCategoryViewModelBase
} from '@models';

// Add/Delete category`
export const TARIFF_CATEGORY_ADD_NEW_CATEGORY = '[Tariff Categories Form] TARIFF_CATEGORY_ADD_NEW_CATEGORY';
export const TARIFF_CATEGORY_ADD_NEW_CATEGORY_FOR_VERSION = '[Tariff Categories Form] TARIFF_CATEGORY_ADD_NEW_CATEGORY_FOR_VERSION';
export const TARIFF_CATEGORY_DELETE_CATEGORY = '[Tariff Categories Form] TARIFF_CATEGORY_DELETE_CATEGORY';
export const TARIFF_CATEGORY_CHANGE_SUPPLY_TYPE = '[Tariff Categories Form] TARIFF_CATEGORY_CHANGE_SUPPLY_TYPE';
export const TARIFF_CATEGORY_RESET_RULE = '[Tariff Categories Form] TARIFF_CATEGORY_RESET_RULE';
export class TariffCategoryChangeCategorySupplyType implements StoreAction {
  readonly type = TARIFF_CATEGORY_CHANGE_SUPPLY_TYPE;

  constructor(public featureName: string, public payload: { categoryId: string, supplyType: number }) {
  }
}

export class TariffCategoryResetRule implements StoreAction {
  readonly type = TARIFF_CATEGORY_RESET_RULE;

  constructor(public featureName: string, public payload: { categoryId: string }) {
  }
}
export class TariffCategoryAdd implements StoreAction {
  readonly type = TARIFF_CATEGORY_ADD_NEW_CATEGORY;

  constructor(public featureName: string, public payload: TariffCategoryViewModelBase[]) {
  }
}

export class TariffCategoryAddForVersion implements StoreAction {
  readonly type = TARIFF_CATEGORY_ADD_NEW_CATEGORY_FOR_VERSION;

  constructor(public featureName: string) {
  }
}

export class TariffCategoryDelete implements StoreAction {
  readonly type = TARIFF_CATEGORY_DELETE_CATEGORY;

  constructor(public featureName: string, public payload: number) {
  }
}

// Work with Rules
export const TARIFF_CATEGORY_ADD_NEW_RULE = '[Tariff Categories Form] TARIFF_CATEGORY_ADD_NEW_RULE';
export const TARIFF_CATEGORY_DELETE_RULE = '[Tariff Categories Form] TARIFF_CATEGORY_DELETE_RULE';
export const TARIFF_CATEGORY_SET_RULE_LOGICAL_OPERATOR = '[Tariff Categories Form] TARIFF_CATEGORY_SET_RULE_LOGICAL_OPERATOR';
export const TARIFF_CATEGORY_CHANGE_RULE = '[Tariff Categories Form] TARIFF_CATEGORY_CHANGE_RULE';

export class TariffCategoryAddNewRule implements StoreAction {
  readonly type = TARIFF_CATEGORY_ADD_NEW_RULE;

  constructor(public featureName: string, public payload: { categoryId: string, groupId: string, ruleId: string }) {
  }
}

export class TariffCategoryDeleteRule implements StoreAction {
  readonly type = TARIFF_CATEGORY_DELETE_RULE;

  constructor(public featureName: string, public payload: { categoryId: string, groupId: string, ruleId: string }) {
  }
}

export class TariffCategorySetRuleLogicalOperator implements StoreAction {
  readonly type = TARIFF_CATEGORY_SET_RULE_LOGICAL_OPERATOR;

  constructor(public featureName: string,
              public payload: {
                categoryId: string,
                groupId: string,
                ruleId: string
                operator: LogicalOperators,
              }
  ) {
  }
}

export class TariffCategoryChangeRule implements StoreAction {
  readonly type = TARIFF_CATEGORY_CHANGE_RULE;

  constructor(
    public featureName: string,
    public payload: {
      categoryId: string,
      groupId: string,
      rule: TariffCategoryRuleViewModel,
    }
  ) {
  }
}

// Work with Groups
export const TARIFF_CATEGORY_ADD_NEW_GROUP = '[Tariff Categories Form] TARIFF_CATEGORY_ADD_NEW_GROUP';
export const TARIFF_CATEGORY_SET_GROUP_LOGICAL_OPERATOR = '[Tariff Categories Form] TARIFF_CATEGORY_SET_GROUP_LOGICAL_OPERATOR';

export class TariffCategoryAddNewGroup implements StoreAction {
  readonly type = TARIFF_CATEGORY_ADD_NEW_GROUP;

  constructor(
    public featureName: string,
    public payload: { categoryId: string, groupId: string }) {
  }
}

export class TariffCategorySetGroupLogicalOperator implements StoreAction {
  readonly type = TARIFF_CATEGORY_SET_GROUP_LOGICAL_OPERATOR;

  constructor(
    public featureName: string,
    public payload: {
      categoryId: string,
      groupId: string,
      operator: LogicalOperators,
    }
  ) {
  }
}

// GET Attributes
export const API_GET_EQUIPMENT_ATTRIBUTES = '[Supplier Categories] API_GET_EQUIPMENT_ATTRIBUTES';
export const API_GET_EQUIPMENT_ATTRIBUTES_SUCCEEDED = '[Supplier Categories] API_GET_EQUIPMENT_ATTRIBUTES_SUCCEEDED';

export class ApiGetEquipmentAttributes implements StoreAction {
  readonly type = API_GET_EQUIPMENT_ATTRIBUTES;

  constructor(public payload?: boolean) {
  }
}

export class ApiGetEquipmentAttributesSucceeded implements StoreAction {
  readonly type = API_GET_EQUIPMENT_ATTRIBUTES_SUCCEEDED;

  constructor(public payload: EquipmentAttributeViewModel[]) {
  }
}

export type Action =
  | TariffCategoryAdd
  | TariffCategoryAddForVersion
  | TariffCategoryDelete
  | TariffCategoryChangeCategorySupplyType
  | TariffCategoryResetRule
  | TariffCategoryAddNewRule
  | TariffCategoryDeleteRule
  | TariffCategorySetRuleLogicalOperator
  | TariffCategoryAddNewGroup
  | TariffCategorySetGroupLogicalOperator
  | TariffCategoryChangeRule
  | ApiGetEquipmentAttributes
  | ApiGetEquipmentAttributesSucceeded;
