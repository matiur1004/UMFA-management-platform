import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SupplyType} from '@models';

@Component({
  selector: 'tenants-list',
  templateUrl: './tenants-list.component.html',
  styleUrls: ['./tenants-list.component.less']
})
export class TenantsListComponent implements OnInit {

  @Input() tenants: any[] = [];
  @Output() expandToggleTenantEvent = new EventEmitter<any>();
  serviceType = SupplyType;
  types: SupplyType[] = [SupplyType.Electricity, SupplyType.Water, SupplyType.Sewerage];
  supplyTypeNames = {
    [SupplyType.Electricity]: 'electricity',
    [SupplyType.Water]: 'water',
    [SupplyType.Gas]: 'gas',
    [SupplyType.Sewerage]: 'sewerage',
    [SupplyType.AdHoc]: 'ad-hoc',
  };

  constructor() {
  }

  ngOnInit() {
  }

  expandToggleTenant(tenantId: string) {
    this.expandToggleTenantEvent.emit(tenantId);
  }
}
