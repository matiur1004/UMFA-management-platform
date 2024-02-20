import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FindLineItemCategoriesPipe} from 'app/shared/pipes/find-line-item.pipe';
import {MarkRecommendedCategoryPipe} from 'app/shared/pipes/mark-recommended-category.pipe';
import {ChildNodeAssignmentViewModel} from '../../../../shared/models';
import {EquipmentAttributeViewModel} from '@models';
import {SearchFilterModel} from '../../../../shared/models/search-filter.model';
import {
  AllocatedTariffDetailViewModel,
  AllocatedTariffLineItemViewModel,
  ApprovalInfoViewModel
} from '../../../../shared/models/node-allocated-tariff.model';
import {StringExtension} from '@shared-helpers';

@Component({
  selector: 'tariffs-per-meters',
  templateUrl: './tariffs-per-meters.component.html',
  styleUrls: ['./tariffs-per-meters.component.less'],
  providers: [FindLineItemCategoriesPipe, MarkRecommendedCategoryPipe]
})
export class TariffsPerMetersComponent implements OnInit {
  @Input() branchId: string;
  @Input() buildingId: string;
  @Input() versionId: string;
  @Input() supplyType: number;
  @Input() tariffs: any[];
  @Input() recommendedTariffs: any;
  @Input() suppliers: any[];
  @Input() attributes: EquipmentAttributeViewModel[];
  @Input() buildingPeriodIsFinalized: boolean;
  public nodes: ChildNodeAssignmentViewModel[];
  public filter: SearchFilterModel;
  @Input() costProviderActive = false;
  @Output() updatedTariffsList = new EventEmitter();
  @Output() save = new EventEmitter();

  constructor(
    private findLineItemCategories: FindLineItemCategoriesPipe,
    private markRecommendedCategory: MarkRecommendedCategoryPipe
  ) {
  }

  private _nodeTariffs: any[];

  get nodeTariffs() {
    return this._nodeTariffs;
  }

  @Input() set nodeTariffs(value) {
    this._nodeTariffs = value;
  };

  @Input() set allocatedNodes(value: any[]) {
    this.nodes = [];
    if (value) {
      value.forEach(node => {
        this.nodes.push({
          ...node
        });
      });
    }
  }

  ngOnInit() {
  }

  onTariffAdded(node, ev) {
    const tariff = <AllocatedTariffDetailViewModel>{
      id: ev.id,
      isBilling: true,
      lineItems: [],
      nodeId: node.nodeId,
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
      categories = this.markRecommendedCategory.transform(categories, this.recommendedTariffs[node.nodeId], ev.id);
      // Get first category from filtered and sorted (by recomended & name) list
      const categoryId = (categories.length && categories[0].id) ? categories[0].id : null;

      const lineItem = <AllocatedTariffLineItemViewModel>{
        categoryId: categoryId,
        id: el.id,
        isActive: true,
        isBilling: true,
        hasDuplicationFactor: el.hasDuplicationFactor
      };

      if (categoryId) {
        const isRecommended = this.isCategoryRecommended(ev.id, categoryId, this.recommendedTariffs[node.nodeId]);
        this.onCategorySelected(lineItem, {isRecommended: isRecommended});
      }

      return lineItem;
    });
    if (!this.nodeTariffs.some(el => el.id === tariff.id && el['nodeId'] === tariff['nodeId'])) {
      this.nodeTariffs.push(tariff);
      if (this.nodeTariffs.length === 1) {
        this.setBillingStatusForTariff(tariff, true)
      }
    }

    this.updatedTariffsList.emit({tariffs: this.nodeTariffs});
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

  onCategorySelected(lineItem, ev) {
    if (ev.isRecommended) {
      lineItem.approvalInfo = null;
    } else {
      lineItem.approvalInfo = <ApprovalInfoViewModel>{
        userId: StringExtension.NewGuid()
      };
    }
  }

  onSelectedNode(item, ev) {
    item.approvalInfo.comment = ev.comment;
    item.approvalInfo.file = ev.file;
    item.approvalInfo.userName = ev.userName;
    item.approvalInfo.date = null;
    item.approvalInfo.userId = null;
  }

  onTariffRemoved(node, tariff) {
    this.nodeTariffs = this.nodeTariffs.filter(el => el !== tariff);
    this.ensureLastTarifIsBilled(node.nodeId);
    this.updatedTariffsList.emit({tariffs: this.nodeTariffs});
  }

  onTariffBillingChanged(nodeId: string, tariff: any, checkboxTarget: any) {
    const isChecked = tariff.isBilling;
    const canChangeState = !isChecked && this.getBillingTariffsForNode(nodeId).length;
    if (canChangeState === 0) {
      checkboxTarget.checked = true;
      this.setBillingStatusForTariff(tariff, true);
    }
  }

  onSave(version) {
    this.save.emit({version, tariffs: this.nodeTariffs});
  }

  onSearch(ev: SearchFilterModel) {
    this.filter = ev;
  }

  private getBillingTariffsForNode(nodeId) {
    return this.nodeTariffs.filter(x => x.nodeId === nodeId && x.isBilling);
  }

  private ensureLastTarifIsBilled(nodeId) {
    const tariffs = this.nodeTariffs.filter(x => x.nodeId === nodeId);
    if (!tariffs.length) {
      return;
    }

    const noBilledTariffs = !!tariffs.find(x => x.isBilling);

    if (tariffs.length === 1 || noBilledTariffs) {
      this.setBillingStatusForTariff(tariffs[0], true);
    }
  }
}
