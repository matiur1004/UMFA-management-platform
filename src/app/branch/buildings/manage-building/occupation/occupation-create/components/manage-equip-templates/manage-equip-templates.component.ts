import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FieldType, SupplyType} from '@models';
import {OrderEquipmentTemplate} from 'app/branch/buildings/manage-building/building-equipment/shared/models/equipment.model';

@Component({
  selector: 'manage-equip-templates',
  templateUrl: './manage-equip-templates.component.html',
  styleUrls: ['./manage-equip-templates.component.less']
})
export class ManageEquipTemplatesComponent implements OnInit {

  @Input() equipmentTemplates: any[];
  @Input() searchKey: string;
  @Input() assignedEquipmentTemplatesCount: number;

  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();
  @Output() save = new EventEmitter();

  @Output() updateOrderIndex = new EventEmitter<number>();
  @Output() search = new EventEmitter<string>();
  @Output() addEquipmentTemplate = new EventEmitter<string>();
  @Output() removeEquipmentTemplate = new EventEmitter<string>();

  orderIndex: number = 1;
  supplyType = SupplyType;
  orderType = OrderEquipmentTemplate;
  fieldType = FieldType;

  constructor() {
  }

  ngOnInit() {
  }

  canNavigate(): boolean {
    return true;
  }

  onNext() {
    this.save.emit();
    this.next.emit();
  }

  onAddRemoveEquipmentTemplate(equipmentTemplateId: string, flag: boolean) {
    if (flag) {
      this.removeEquipmentTemplate.emit(equipmentTemplateId);
    } else {
      this.addEquipmentTemplate.emit(equipmentTemplateId);
    }
  }

  changeOrderIndex(idx) {
    if (this.orderIndex == idx || (this.orderIndex == (idx * -1)))
      this.orderIndex *= -1;
    else
      this.orderIndex = idx;

    this.updateOrderIndex.emit(this.orderIndex);
  }

}
