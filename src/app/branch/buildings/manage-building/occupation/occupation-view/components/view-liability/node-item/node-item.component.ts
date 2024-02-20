import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {SupplyType} from '@models';

@Component({
  selector: 'node-item',
  templateUrl: './node-item.component.html',
  styleUrls: ['./node-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeItemComponent {
  @Input()
  supplyTypeIndexesToShow: number[] = [];
  supplyType = SupplyType;

  constructor() {
  }
}
