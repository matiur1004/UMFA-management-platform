import { Component, OnInit, Input } from '@angular/core';
import { SupplyType } from '@app/shared/models';

@Component({
  selector: 'tenant-detail',
  templateUrl: './tenant-detail.component.html',
  styleUrls: ['./tenant-detail.component.less']
})
export class TenantDetailComponent implements OnInit {

  @Input() details: any;
  serviceType = SupplyType;
  types: SupplyType[] = [SupplyType.Electricity, SupplyType.Water, SupplyType.Sewerage];
  supplyTypeNames = {
    [SupplyType.Electricity]: 'electricity',
    [SupplyType.Water]: 'water',
    [SupplyType.Gas]: 'gas',
    [SupplyType.Sewerage]: 'sewerage',
    [SupplyType.AdHoc]: 'ad-hoc',
  };
  
  constructor() { }

  ngOnInit(): void {
    this.details = this.details.map((item) => {
      item.shopOwnCosts.nodeTariffSections = item.shopOwnCosts.nodeTariffSections.filter((section => {
        return section['isOwnerLiability'];
      }))
      return item;
    })
  }

}
