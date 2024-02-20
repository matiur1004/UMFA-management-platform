import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SupplyType } from '@app/shared/models';

@Component({
  selector: 'detail-consumption-item',
  templateUrl: './detail-consumption-item.component.html',
  styleUrls: ['./detail-consumption-item.component.less']
})
export class DetailConsumptionItemComponent implements OnInit {

  @Input() item: any;
  @Output() expandToggleTenantEvent = new EventEmitter<any>();

  serviceType = SupplyType;
  costSum: number;
  constructor() { }

  ngOnInit(): void {
    if(this.item.isFirst) {
      this.costSum = 0;
      this.item.costs.forEach(cost => {
        this.costSum += cost.totalIncVat;
      })
    }
    
  }

  onTenantExpand(item) {
    this.expandToggleTenantEvent.emit(item);
  }
}
