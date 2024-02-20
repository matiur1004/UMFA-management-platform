import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {numberMask} from '@shared-helpers';
import {
  DropdownItem,
  EquipmentAttributeViewModel,
  EquipmentComboSettingsViewModel,
  LogicalOperators,
  TariffCategoryRuleViewModel
} from '@models';

@Component({
  selector: 'rule-item',
  templateUrl: './rule-item.component.html',
  styleUrls: ['./rule-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RuleItemComponent implements OnInit {

  LogicalOperators = LogicalOperators;
  numberMask = numberMask();

  @Input() rule: TariffCategoryRuleViewModel;
  @Input() attributes: EquipmentAttributeViewModel;
  @Input() attributeComboValues: { [details: string]: EquipmentComboSettingsViewModel[] };
  @Input() operatorsDropdown: DropdownItem[];
  @Input() isFirst = false;
  @Input() isOne = true;
  @Input() errors: { [details: string]: any }
  @Input() isLogicalOperatorChecked: boolean;
  @Input() isOneGroup: boolean;

  @Output() ruleAdded: EventEmitter<void> = new EventEmitter<void>();
  @Output() ruleDeleted: EventEmitter<void> = new EventEmitter<void>();
  @Output() ruleLogicalOperatorChanged: EventEmitter<LogicalOperators> = new EventEmitter<LogicalOperators>();
  @Output() ruleChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() groupAdded: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }

  onLogicalOperatorChange(operator: LogicalOperators): void {
    setTimeout(() => this.ruleLogicalOperatorChanged.emit(operator));
  }

  onAddRule(): void {
    this.ruleAdded.emit();
  }

  onDeleteRule(): void {
    this.ruleDeleted.emit();
  }

  onAddGroup(): void {
    this.groupAdded.emit();
  }

  onRuleChange(payload: any): void {
    this.ruleChanged.emit({...this.rule, ...payload});
  }

  onChangeAttribute(e): void {
    this.onRuleChange({attributeId: e.id, comparisonOperator: null, value: null});
  }

  onChangeComparison(e): void {
    this.onRuleChange({comparisonOperator: e.value});
  }

  onChangeCombo(e): void {
    this.onRuleChange({value: e.value});
  }

  onChangeValue(e): void {
    this.onRuleChange({value: e ? +e : null});
  }

  ngOnInit() {
  }

}
