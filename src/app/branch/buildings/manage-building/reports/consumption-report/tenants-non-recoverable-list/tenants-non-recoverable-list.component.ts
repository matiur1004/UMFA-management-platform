import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SupplyType } from '@app/shared/models';

@Component({
  selector: 'tenants-non-recoverable-list',
  templateUrl: './tenants-non-recoverable-list.component.html',
  styleUrls: ['./tenants-non-recoverable-list.component.less']
})
export class TenantsNonRecoverableListComponent implements OnChanges {
  @Output() expandToggleNonRecoverableTenantEvent = new EventEmitter<any>();
  @Input() ownerLiability;
  @Input() ownerTenants;
  @Input() vacants;
  @Input() vacantShops;
  @Input() vacantTenants;
  @Input() tenantsNotLiable;
  @Input() tenantsNotLiableTenants;

  serviceType = SupplyType;
  types: SupplyType[] = [SupplyType.Electricity, SupplyType.Water, SupplyType.Sewerage];
  supplyTypeNames = {
    [SupplyType.Electricity]: 'electricity',
    [SupplyType.Water]: 'water',
    [SupplyType.Gas]: 'gas',
    [SupplyType.Sewerage]: 'sewerage',
    [SupplyType.AdHoc]: 'ad-hoc',
  };

  vacantsSum: any;
  ownerLiabilitySum: any;
  tenantNotLiableSum: any;

  selectedCategory: string;

  ownerLiabilityExpanded: boolean = false;
  vacantsExpanded: boolean = false;
  tenantsNotLiableExpanded: boolean = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    this.ownerTenants.forEach(t => {
      t.sum = {
        total: t.totals.reduce((prev, cur) => prev + cur.total, 0),
        totalIncVat: t.totals.reduce((prev, cur) => prev + cur.totalIncVat, 0)
      };
      t.sum.vat = t.sum.totalIncVat - t.sum.total;
    });
    this.ownerLiabilitySum = {
      total: this.ownerTenants.reduce((prev, cur) => prev + cur.sum.total, 0),
      totalIncVat: this.ownerTenants.reduce((prev, cur) => prev + cur.sum.totalIncVat, 0)
    };
    this.ownerLiability = this.ownerLiability.map(item => {
      item.total = 0; item.totalIncVat = 0;
      this.ownerTenants.forEach(tenant => {
        let supplyItem = tenant.totals.find((obj) => obj.supplyType == item.supplyType);
        item.total += supplyItem.total;
        item.totalIncVat += supplyItem.totalIncVat;
      })
      return item;
    })
    this.tenantsNotLiableTenants.forEach(t => {
      t.sum = {
        total: t.totals.reduce((prev, cur) => prev + cur.total, 0),
        totalIncVat: t.totals.reduce((prev, cur) => prev + cur.totalIncVat, 0)
      };
      t.sum.vat = t.sum.totalIncVat - t.sum.total;
    });
    this.tenantNotLiableSum = {
      total: this.tenantsNotLiableTenants.reduce((prev, cur) => prev + cur.sum.total, 0),
      totalIncVat: this.tenantsNotLiableTenants.reduce((prev, cur) => prev + cur.sum.totalIncVat, 0)
    };
    this.tenantsNotLiable = this.tenantsNotLiable.map(item => {
      item.total = 0; item.totalIncVat = 0;
      this.tenantsNotLiableTenants.forEach(tenant => {
        let supplyItem = tenant.totals.find((obj) => obj.supplyType == item.supplyType);
        item.total += supplyItem.total;
        item.totalIncVat += supplyItem.totalIncVat;
      })
      return item;
    })
    this.vacantTenants.forEach(t => {
      t.sum = {
        total: t.totals.reduce((prev, cur) => prev + cur.total, 0),
        totalIncVat: t.totals.reduce((prev, cur) => prev + cur.totalIncVat, 0)
      };
      t.sum.vat = t.sum.totalIncVat - t.sum.total;
    });
    this.vacants= this.vacants.map(item => {
      item.total = 0; item.totalIncVat = 0;
      this.vacantTenants.forEach(tenant => {
        let supplyItem = tenant.totals.find((obj) => obj.supplyType == item.supplyType);
        item.total += supplyItem.total;
        item.totalIncVat += supplyItem.totalIncVat;
      })
      return item;
    })
    this.vacantsSum = {
      total: this.vacantTenants.reduce((prev, cur) => prev + cur.sum.total, 0),
      totalIncVat: this.vacantTenants.reduce((prev, cur) => prev + cur.sum.totalIncVat, 0)
    };
    this.vacantShops.forEach(t => {
      t.sum = {
        total: t.costs.reduce((prev, cur) => prev + cur.total, 0),
        totalIncVat: t.costs.reduce((prev, cur) => prev + cur.totalIncVat, 0)
      }
      t.sum.vat = t.sum.totalIncVat - t.sum.total;
    })
  }

  expandToggleNonRecoverable(category: string) {
    this.selectedCategory = category;
    if(category == 'ownerLiability')
      this.ownerLiabilityExpanded = !this.ownerLiabilityExpanded;
    else if (category == 'vacants')
      this.vacantsExpanded = !this.vacantsExpanded;
    else 
      this.tenantsNotLiableExpanded = !this.tenantsNotLiableExpanded;
  }

  expandToggleTenant(tenantId: string, category: string) {
    console.log('tenant Id', tenantId);
    this.expandToggleNonRecoverableTenantEvent.emit({tenantId, category});
  }
}
