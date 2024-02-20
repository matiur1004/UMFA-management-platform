import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {DialogSelectNodesInputDataModel} from '../../models/dialog-select-nodes-input-data.model';
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
  selector: 'dialog-select-nodes',
  templateUrl: './dialog-select-nodes.component.html',
  styleUrls: ['./dialog-select-nodes.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DialogSelectNodesComponent implements OnInit {
  @Input() data: DialogSelectNodesInputDataModel;

  public nodes: NodeDetailViewModel[];
  public shops: EquipmentTreeShopModel[];
  public areas: any[];
  public tariffs: VersionViewModel<TariffViewModel>[];
  public attributes: EquipmentAttributeViewModel[];
  public supplies: SupplyToViewModel[];
  public filter: SearchFilterModel;

  constructor(
    public activeModal: NgbActiveModal
  ) {
  }

  ngOnInit() {
    this.nodes = this.data.nodes;
    this.shops = this.data.shops;
    this.tariffs = this.data.tariffs;
    this.attributes = this.data.attributes;
    this.supplies = this.data.supplies;
    this.areas = this.data.areas;
  }

  onSearch(ev: SearchFilterModel) {
    this.filter = ev;
  }

  close() {
    const response = this.nodes.filter(el => el.isSelected);
    if (response.length) {
      response.forEach(el => el.isSelected = false)
      this.activeModal.close(response);
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
