import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {OrderEquipment} from '../../../shared/models';


@Component({
  selector: 'add-meters',
  templateUrl: './add-meters.component.html',
  styleUrls: ['./add-meters.component.less']
})
export class AddMetersComponent implements OnInit, OnChanges {

  @Input() nodes: any[];
  @Input() allocatedNodes: { [key: string]: any };
  @Input() registers: any[];
  @Input() selectedRegisterText: string;
  @Input() buildingPeriodIsFinalized: boolean;

  @Output() showNodesAllocation = new EventEmitter();
  @Output() toggleNodeAllocation = new EventEmitter();
  @Output() search = new EventEmitter();
  @Output() updateRegisterFilter = new EventEmitter();
  @Output() changeOrderIndex = new EventEmitter();

  orderType = OrderEquipment;
  registersDict = {};
  orderIndex = 2;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if (changes.registers) {
      this.registersDict = (this.registers || []).reduce((dict, r) => {
        dict[r.id] = r;
        return dict;
      }, {});
    }
  }

  onSave() {
    this.showNodesAllocation.emit(false);
  }

  onChangeOrderIndex(idx) {
    if (this.orderIndex === idx || (this.orderIndex === (idx * -1))) {
      this.orderIndex *= -1;
    } else {
      this.orderIndex = idx;
    }

    this.changeOrderIndex.emit(this.orderIndex);
  }

}
