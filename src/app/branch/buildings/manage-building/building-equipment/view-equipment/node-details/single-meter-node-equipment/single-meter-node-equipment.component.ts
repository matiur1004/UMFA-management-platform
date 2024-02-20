import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FieldType} from '@models';

@Component({
  selector: 'single-meter-node-equipment',
  templateUrl: './single-meter-node-equipment.component.html',
  styleUrls: ['./single-meter-node-equipment.component.less']
})
export class SingleMeterNodeEquipment {
  @Input() meter: any;
  @Output() meterClick = new EventEmitter();

  fieldType = FieldType;

  onMeterClick(meterId) {
    this.meterClick.emit(meterId);
  }
}
