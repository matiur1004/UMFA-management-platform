import {Observable} from 'rxjs';
import {
  EquipmentAttributeViewModel,
  EquipmentComboSettingsViewModel,
  LogicalOperators,
  SupplyType,
  TariffCategoryRuleViewModel
} from '@models';

export abstract class TariffCategoriesService {
  abstract getEquipmentAttributes(): Observable<EquipmentAttributeViewModel[]>;

  abstract getEquipmentAttributesComoboSettings(): Observable<{ [key: string]: EquipmentComboSettingsViewModel[] }>;

  abstract getSupplyTypes(): Observable<SupplyType[]>;

  abstract tariffCategoryAddRule(payload: { categoryId: string; groupId: string; ruleId: string; });

  abstract tariffCategoryChangeRule(payload: { categoryId: string; groupId: string; rule: TariffCategoryRuleViewModel; }): void;

  abstract tariffCategoryChangeGroupRelationship(payload: { categoryId: string; groupId: string; operator: LogicalOperators; }): void;

  abstract tariffCategoryChangeRuleRelationship(payload: { categoryId: string; groupId: string; ruleId: string; operator: LogicalOperators; }): void;

  abstract tariffCategoryDeleteRule(payload: { categoryId: string; groupId: string; ruleId: string; }): void;

  abstract tariffCategoryAddGroup(payload: { categoryId: string; groupId: string; }): void;

  abstract tariffCategoryAddCategory(perVersion: boolean);

  abstract tariffCategoryDeleteCategory(categoryIndex: number);

  abstract tariffCategoryChangeCategorySupplyType(payload: { categoryId: string; supplyType: number; });

  abstract tariffCategoryResetRule(payload: { categoryId: string; });
}
