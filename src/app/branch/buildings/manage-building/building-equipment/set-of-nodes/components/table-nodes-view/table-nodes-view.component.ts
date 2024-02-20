import {Component, HostBinding, Input} from '@angular/core';
import {NodeDetailViewModel} from '../../../shared/models';
import {
  EquipmentAttributeViewModel,
  EquipmentTreeShopModel,
  SupplyToViewModel,
  TariffViewModel,
  VersionViewModel
} from '@models';
import {SearchFilterModel} from '../../../shared/models/search-filter.model';

@Component({
  selector: 'table-nodes-view',
  templateUrl: './table-nodes-view.component.html',
  styleUrls: ['./table-nodes-view.component.less']
})
export class TableNodeItemViewComponent {
  @HostBinding('class') classes = 'node-item';
  @Input('nodes') nodes: NodeDetailViewModel[];
  @Input('shops') shops: EquipmentTreeShopModel[];
  @Input('areas') areas: any[];
  @Input('tariffs') tariffs: VersionViewModel<TariffViewModel>[];
  @Input('attributes') attributes: EquipmentAttributeViewModel[];
  @Input('supplies') supplies: SupplyToViewModel[];
  @Input('filter') filter: SearchFilterModel;

  public isAllSelected: boolean = false;

  constructor() {
  }

  onSelect(node: NodeDetailViewModel) {
    node.isSelected = !node.isSelected;
    this.isAllSelected = !this.nodes.some(el => !el.isSelected);
  }

  onSelectAll() {
    let isSelected = true;
    if (this.nodes.some(el => !el.isSelected)) {
      isSelected = false;
    }
    this.isAllSelected = !isSelected;
    this.nodes.forEach(el => el.isSelected = !isSelected);
  }
}
