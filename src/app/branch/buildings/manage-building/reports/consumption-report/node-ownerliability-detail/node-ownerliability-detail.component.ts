import { Component, OnInit, Input } from '@angular/core';
import { SupplyType } from '@app/shared/models';

@Component({
  selector: 'app-node-ownerliability-detail',
  templateUrl: './node-ownerliability-detail.component.html',
  styleUrls: ['./node-ownerliability-detail.component.less']
})
export class NodeOwnerliabilityDetailComponent implements OnInit {

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
