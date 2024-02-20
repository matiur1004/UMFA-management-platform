import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SearchFilterModel} from '../../../shared/models/search-filter.model';
import {NodeDetailViewModel} from '../../../shared/models';
import {EquipmentAttributeViewModel, EquipmentTreeShopModel, TariffViewModel, VersionViewModel} from '@models';
import {
  AllocatedTariffDetailViewModel,
  ApprovalInfoViewModel
} from '../../../shared/models/node-allocated-tariff.model';
import {FindLineItemCategoriesPipe} from 'app/shared/pipes/find-line-item.pipe';
import {MarkRecommendedCategoryPipe} from 'app/shared/pipes/mark-recommended-category.pipe';
import {StringExtension} from '@shared-helpers';

@Component({
  selector: 'table-nodes-edit',
  templateUrl: './table-nodes-edit.component.html',
  styleUrls: ['./table-nodes-edit.component.less'],
  providers: [FindLineItemCategoriesPipe, MarkRecommendedCategoryPipe]
})
export class TableNodesEditComponent {
  @Input() supplyType: number;
  @Input() buildingId: string;
  @Input() versionId: string;

  @Input('nodes') nodes: NodeDetailViewModel[];
  @Input('shops') shops: EquipmentTreeShopModel[];
  @Input('areas') areas: any[];
  @Input('tariffs') tariffs: VersionViewModel<TariffViewModel>[];
  @Input('attributes') attributes: EquipmentAttributeViewModel[];
  @Input('suppliers') suppliers: any[];
  @Input('recommendedTariffs') recommendedTariffs: any[];
  @Input('filter') filter: SearchFilterModel;
  public isAllSelected = false;

  @Output() onDelete: EventEmitter<NodeDetailViewModel> = new EventEmitter<NodeDetailViewModel>();

  constructor(
    private findLineItemCategories: FindLineItemCategoriesPipe,
    private markRecommendedCategory: MarkRecommendedCategoryPipe
  ) {
  }

  onSelect(node: NodeDetailViewModel) {
    node.isSelected = !node.isSelected;
    this.isAllSelected = this.nodes.every(el => {
      if (el.tariffApplyType === 0) {
        return el.isSelected;
      } else if (el.tariffApplyType === 1) {
        return el.nodes.every(n => n.isSelected)
      }
    });
  }

  onSelectAll() {
    this.isAllSelected = !this.isAllSelected;
    this.nodes.forEach(el => {
      if (el.tariffApplyType === 0) {
        el.isSelected = this.isAllSelected;
      } else if (el.tariffApplyType === 1) {
        el.nodes.forEach(n => {
          n.isSelected = this.isAllSelected;
        });
      }
    });
  }

  setBillingStatusForTariff(tariff, status: boolean) {
    tariff.isBilling = status;
    if (tariff.lineItems) {
      tariff.lineItems.forEach(litem => {
        litem.isBilling = status;
      });
    }
  }

  isCategoryRecommended(tariffId, lineId, recommendedTariffs) {
    const tariff = recommendedTariffs.find(el => el.tariffVerionId === tariffId);
    if (tariff) {
      if (tariff.applicableLineItemsCategories.indexOf(lineId) !== -1) {
        return true;
      }
    }
    return false;
  }

  onTariffAdded(node: NodeDetailViewModel, ev, subnodeId: string = null) {
    const tariff = <AllocatedTariffDetailViewModel>{
      id: ev.id,
      isBilling: false,
      lineItems: [],
      nodeId: subnodeId,
      duplicationFactor: 1
    };

    if (ev.isRecommended) {
      tariff.approvalInfo = null;
    } else {
      tariff.approvalInfo = <ApprovalInfoViewModel>{
        userId: StringExtension.NewGuid()
      };
    }

    tariff.lineItems = ev.entity.lineItems.map(el => {
      let categories = this.findLineItemCategories.transform(this.tariffs, ev.id, el.id);
      categories = this.markRecommendedCategory.transform(categories, this.recommendedTariffs[node.id], ev.id);
      // Get first category from filtered and sorted (by recomended & name) list
      const categoryId = (categories.length && categories[0].id) ? categories[0].id : null;

      const lineItem = {
        categoryId: categoryId,
        id: el.id,
        isActive: true,
        isBilling: false
      };

      if (categoryId) {
        const isRecommended = this.isCategoryRecommended(ev.id, categoryId, this.recommendedTariffs[node.id]);
        this.onCategorySelected(lineItem, {isRecommended: isRecommended});
      }

      return lineItem;
    });
    // Add trariff if it is absent
    if (!node.tariffs.some(el => el.id === tariff.id && el.nodeId === tariff.nodeId)) {
      node.tariffs.push(tariff);

      //Set billing if need
      if (subnodeId) {
        const tariffs = node.tariffs.filter(el => el.nodeId === subnodeId);
        if (tariffs.length === 1) {
          this.setBillingStatusForTariff(tariffs[0], true)
        }
      } else if (node.tariffs.length === 1) {
        this.setBillingStatusForTariff(tariff, true)
      }
    }
  }

  onTariffRemoved(node: NodeDetailViewModel, tariff: AllocatedTariffDetailViewModel, subnodeId: string = null) {
    node.tariffs = node.tariffs.filter(el => !(el.id === tariff.id && el.nodeId === tariff.nodeId));
    if (tariff.isBilling) {
      let tariffForSelection;
      if (subnodeId) {
        tariffForSelection = node.tariffs.find(el => el.nodeId === subnodeId);
      } else if (node.tariffs.length) {
        tariffForSelection = node.tariffs[0];
      }
      if (tariffForSelection) {
        this.setBillingStatusForTariff(tariffForSelection, true)
      }
    }
  }

  onTariffBillingChanged(node: NodeDetailViewModel, tariff: any, checkboxTarget: any, subnodeId: string = null) {
    let countBillingTariffs = 0;
    let canChangeState = true;
    const isChecked = checkboxTarget.checked;
    //Check if there are only one checked tariff
    if (isChecked === false) {
      node.tariffs.forEach(el => {
        if (subnodeId) {
          if (el.isBilling && el.nodeId === subnodeId) {
            countBillingTariffs += 1;
          }
        } else {
          countBillingTariffs += el.isBilling ? 1 : 0;
        }

      });
      if (countBillingTariffs === 1) {
        canChangeState = false;
      }
    }
    if (canChangeState) {
      this.setBillingStatusForTariff(tariff, isChecked);
    } else {
      checkboxTarget.checked = true;
    }
  }

  onTariffSelected(tariff: AllocatedTariffDetailViewModel) {
    this.nodes.forEach(node => {
      if (node.isSelected) {
        this.onTariffAdded(node, tariff);
        this.onTariffBillingChanged(node, tariff, {checked: true});
      } else if (node.tariffApplyType) {
        node.nodes.forEach(subnode => {
          if (subnode.isSelected) {
            this.onTariffAdded(node, tariff, subnode.nodeId);
            this.onTariffBillingChanged(node, tariff, {checked: true});
          }
        });
      }
    });
  }

  onCategorySelected(lineItem, ev) {
    if (ev.isRecommended) {
      lineItem.approvalInfo = null;
    } else {
      lineItem.approvalInfo = <ApprovalInfoViewModel>{
        userId: StringExtension.NewGuid()
      };
    }
  }

  onDeleteSelectedNodes() {
    this.nodes.forEach(node => {
      if (node.isSelected) {
        this.onDeleteNode(node);
      } else if (node.tariffApplyType) {
        node.nodes.forEach(subnode => {
          if (subnode.isSelected) {
            this.onDeleteNode(node);
          }
        });
      }
    });
  }

  onDeleteNode(node: NodeDetailViewModel) {
    this.onDelete.emit(node);
  }

  onSelectedNode(item: AllocatedTariffDetailViewModel, ev) {
    item.approvalInfo.comment = ev.currentReadingNotes;
    item.approvalInfo.file = ev.file;
    item.approvalInfo.userName = ev.currentReadingCreatedByUserName;
    item.approvalInfo.date = null;
    item.approvalInfo.userId = null;
  }
}
