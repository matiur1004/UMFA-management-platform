import {StringExtension} from '../helper/string-extension';
import {EquipmentComboSettingsViewModel} from './equipment.model';
import {SupplyType} from './supply-type.model';

export enum LogicalOperators {
  AND,
  OR
}

export enum ComparisonOperators {
  Equal,
  GreaterThan,
  GreaterThanOrEqual,
  LessThan,
  LessThanOrEqual
}

export const ComparisonValuesList = [
  ComparisonOperators.Equal,
  ComparisonOperators.GreaterThan,
  ComparisonOperators.GreaterThanOrEqual,
  ComparisonOperators.LessThan,
  ComparisonOperators.LessThanOrEqual,
];

export const ComparisonOperatorsTextList = [
  {value: ComparisonOperators.Equal, text: '='},
  {value: ComparisonOperators.GreaterThan, text: '>'},
  {value: ComparisonOperators.GreaterThanOrEqual, text: '>='},
  {value: ComparisonOperators.LessThan, text: '<'},
  {value: ComparisonOperators.LessThanOrEqual, text: '<='},
];

// Rules tree interfaces
export interface RulesTreeViewModel {
  groupRelationships: RelationshipModel[];
  groups: RulesTreeGroupViewModel[];
}

export interface RulesTreeGroupViewModel {
  id: string;
  ruleRelationships: RelationshipModel[];
  rules: RulesTreeRuleViewModel[];
}

export interface RulesTreeRuleViewModel {
  id: string;
  comparisonOperator: ComparisonOperators;
  value: number | string;
}

export class TariffCategoryRuleViewModel implements RulesTreeRuleViewModel {
  id: string;
  comparisonOperator: ComparisonOperators;
  value: number | string;
  attributeId: string;
  comboValues?: EquipmentComboSettingsViewModel[];

  constructor() {
    this.id = StringExtension.NewGuid();
    this.attributeId = null;
    this.comparisonOperator = null;
    this.value = null;
  }
}

export class TariffCategoryGroupViewModel implements RulesTreeGroupViewModel {
  id: string;
  ruleRelationships: RelationshipModel[];
  rules: TariffCategoryRuleViewModel[];

  constructor() {
    this.id = StringExtension.NewGuid();
    this.ruleRelationships = [];
    this.rules = [new TariffCategoryRuleViewModel()];
  }
}

export class TariffRuleGroupsViewModel implements RulesTreeViewModel {
  groupRelationships: RelationshipModel[];
  groups: TariffCategoryGroupViewModel[];

  constructor() {
    this.groupRelationships = [];
    this.groups = [new TariffCategoryGroupViewModel()];
  }
}

export abstract class TariffCategoryViewModelBase {
  id: string = StringExtension.NewGuid();
  name: string = null;
  supplyType: SupplyType = null;
  ruleGroups: TariffRuleGroupsViewModel = new TariffRuleGroupsViewModel();

  constructor(supplyType: SupplyType) {
    this.supplyType = supplyType;
  }
}

export class TariffCategoryViewModel extends TariffCategoryViewModelBase {
  supplierId: string = null;
  buildingId: string = null;
}

export class TariffVersionCategoryViewModel extends TariffCategoryViewModelBase {
}

export class RelationshipModel {
  logicalOperator: LogicalOperators;
  firstId: string;
  secondId: string;

  constructor() {
    this.logicalOperator = LogicalOperators.AND;
    this.firstId = null;
    this.secondId = null;
  }
}

export interface TariffCategoryRuleTreeEvent {
  groupId: string;
  ruleId?: string;
  operator?: LogicalOperators,
  rule?: TariffCategoryRuleViewModel
}

