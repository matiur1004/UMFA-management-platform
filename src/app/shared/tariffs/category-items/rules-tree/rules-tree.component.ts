import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {
  DropdownItem,
  EquipmentAttributeViewModel,
  EquipmentComboSettingsViewModel,
  LogicalOperators,
  RelationshipModel,
  TariffCategoryRuleTreeEvent,
  TariffCategoryRuleViewModel
} from '@models';


@Component({
  selector: 'rules-tree',
  templateUrl: './rules-tree.component.html',
  styleUrls: ['./rules-tree.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RulesTreeComponent implements OnInit {

  LogicalOperators = LogicalOperators;

  @Input() groups: any[];
  @Input() attributes: EquipmentAttributeViewModel;
  @Input() attributeComboValues: { [details: string]: EquipmentComboSettingsViewModel[] };
  @Input() operatorsDropdown: DropdownItem[];
  @Input() groupRelationships: any;

  @Output() ruleAdded: EventEmitter<TariffCategoryRuleTreeEvent> = new EventEmitter<TariffCategoryRuleTreeEvent>();
  @Output() ruleDeleted: EventEmitter<TariffCategoryRuleTreeEvent> = new EventEmitter<TariffCategoryRuleTreeEvent>();
  @Output() ruleRelationshipChanged: EventEmitter<TariffCategoryRuleTreeEvent> = new EventEmitter<TariffCategoryRuleTreeEvent>();
  @Output() ruleChanged: EventEmitter<TariffCategoryRuleTreeEvent> = new EventEmitter<TariffCategoryRuleTreeEvent>();
  @Output() groupAdded: EventEmitter<string> = new EventEmitter<string>();
  @Output() groupRelationshipChanged: EventEmitter<TariffCategoryRuleTreeEvent> = new EventEmitter<TariffCategoryRuleTreeEvent>();

  constructor() {
  }

  trackByIndex(index: number) {
    return index;
  }

  getCheckedRelationships(relationships: RelationshipModel[], id: string): boolean {
    const relationship = relationships.find(item => item.secondId === id);
    return relationship ? relationship.logicalOperator === LogicalOperators.OR : false;
  }

  getErrors(control): boolean {
    return control.isSubmitted && control.isInvalid ? control.errors : null;
  }

  onChangeGroupLogicalOperator(groupId: string, operator: LogicalOperators): void {
    setTimeout(() => this.groupRelationshipChanged.emit({groupId, operator}));
  }

  onChangeRuleLogicalOperator(groupId: string, ruleId: string, operator: LogicalOperators): void {
    this.ruleRelationshipChanged.emit({groupId, ruleId, operator});
  }

  onRuleChanged(groupId: string, rule: TariffCategoryRuleViewModel): void {
    this.ruleChanged.emit({groupId, rule});
  }

  onAddNewRule(groupId: string, ruleId: string): void {
    this.ruleAdded.emit({groupId, ruleId});
  }

  onDeleteRule(groupId: string, ruleId: string): void {
    this.ruleDeleted.emit({groupId, ruleId});
  }

  onAddGroup(groupId: string): void {
    this.groupAdded.emit(groupId);
  }

  ngOnInit() {
  }

}
