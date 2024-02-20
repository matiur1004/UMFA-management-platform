import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

import {
  ComparisonOperatorsTextList,
  EquipmentAttributeViewModel,
  EquipmentComboSettingsViewModel,
  LogicalOperators,
  SupplyType,
  TariffCategoryRuleViewModel
} from '@models';
import {getDropdownItemsFromObjects} from '@shared-helpers';
import {TariffCategoriesService} from './tariff-categories.service';

@Component({
  selector: 'category-items',
  templateUrl: './category-items.component.html',
  styleUrls: ['./category-items.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryItemsComponent implements OnInit {

  attributes$: Observable<EquipmentAttributeViewModel[]>;
  attributeComboValues$: Observable<{ [key: string]: EquipmentComboSettingsViewModel[] }>;
  supplyTypes$: Observable<SupplyType[]>;

  SupplyType = SupplyType;
  supplyTypeText = {
    [SupplyType.Electricity]: 'Electricity',
    [SupplyType.Water]: 'Water',
    [SupplyType.Gas]: 'Gas',
    [SupplyType.Sewerage]: 'Sewerage',
    [SupplyType.AdHoc]: 'Ad Hoc'
  };

  comparisonDropdownList = getDropdownItemsFromObjects(ComparisonOperatorsTextList, {label: 'text', value: 'value'});

  @Input() formState: any;
  @Input() isVersionSprecific = false;

  constructor(
    private tariffCategoriesService: TariffCategoriesService
  ) {
  }

  trackByIndex(index: number) {
    return index;
  }

  onChangeRule(categoryId: string, payload: {
    groupId: string,
    rule: TariffCategoryRuleViewModel,
  }): void {
    this.tariffCategoriesService.tariffCategoryChangeRule({categoryId, ...payload})
  }

  onChangeGroupRelationship(categoryId: string, payload: {
    groupId: string,
    operator: LogicalOperators,
  }): void {
    this.tariffCategoriesService.tariffCategoryChangeGroupRelationship({categoryId, ...payload});
  }

  onChangeRuleRelationship(categoryId: string, payload: {
    groupId: string,
    ruleId: string
    operator: LogicalOperators,
  }): void {
    this.tariffCategoriesService.tariffCategoryChangeRuleRelationship({categoryId, ...payload});
  }

  onAddNewRule(categoryId: string, payload: { groupId: string, ruleId: string }): void {
    this.tariffCategoriesService.tariffCategoryAddRule({categoryId, ...payload});
  }

  onDeleteRule(categoryId: string, payload: { groupId: string, ruleId: string }): void {
    this.tariffCategoriesService.tariffCategoryDeleteRule({categoryId, ...payload});
  }

  onAddNewGroup(categoryId: string, groupId: string): void {
    this.tariffCategoriesService.tariffCategoryAddGroup({categoryId, groupId});
  }

  onAddNewCategory() {
    this.tariffCategoriesService.tariffCategoryAddCategory(this.isVersionSprecific);
  }

  onDeleteCategory(categoryIndex: number) {
    this.tariffCategoriesService.tariffCategoryDeleteCategory(categoryIndex);
  }

  onSupplyTypeChange(categoryId: string, supplyType) {
    this.tariffCategoriesService.tariffCategoryChangeCategorySupplyType({categoryId, supplyType});
    this.tariffCategoriesService.tariffCategoryResetRule({categoryId});
  }

  ngOnInit() {
    this.attributes$ = this.tariffCategoriesService.getEquipmentAttributes();
    this.attributeComboValues$ = this.tariffCategoriesService.getEquipmentAttributesComoboSettings();
    this.supplyTypes$ = this.tariffCategoriesService.getSupplyTypes();
  }

  togle() {
    this.formState.controls.categoriesEnabled.value = !this.formState.controls.categoriesEnabled.value;
  }
}
