import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NodeDetailViewModel} from '../../building-equipment/shared/models';
import {NodeService} from '../../building-equipment/shared/node.service';
import {forkJoin} from 'rxjs';
import {DialogSelectTariffsComponent} from './dialog-select-tariffs/dialog-select-tariffs.component';

@Directive({
  selector: '[select-tariff-for-nodes-bind-dialog]'
})
export class SelectTariffForNodesBindDialogDirective {
  @Output() onConfirmerAction: EventEmitter<NodeDetailViewModel[]> = new EventEmitter<NodeDetailViewModel[]>();

  @Input('select-tariff-for-nodes-bind-dialog') nodes: NodeDetailViewModel[];
  @Input() supplyType: number;
  @Input() buildingId: string;
  @Input() versionId: string;

  constructor(
    private modalService: NgbModal,
    private nodeService: NodeService,
  ) {
  }

  @HostListener('click', ['$event']) onClick() {
    const nodeIds = this.collectSelectedNodes(this.nodes);
    const excludeTariffs = this.colloectTariffsForExcluding(this.nodes);

    if (nodeIds.length) {
      forkJoin(
        this.nodeService.getTariffsForBuilding(this.buildingId, this.supplyType, this.versionId),
        this.nodeService.getRecomendedCategoriesForTariffsByNode(this.buildingId, this.versionId, nodeIds)
      ).subscribe(([tariffsForBuilding, recommendedCategories]) => {
        const nodesTariffs = this.filterApplicableNodesTariffs(recommendedCategories);
        const listIds = this.filterTariffsThatAreRecommendedForAllNodes(nodesTariffs, nodeIds.length);
        // excluded tariffs that was added
        tariffsForBuilding = tariffsForBuilding.filter(el => excludeTariffs.indexOf(el.id) === -1 && el.isActual);
        // mark tariffs as recommended (or not)
        const recommendedTariffs = tariffsForBuilding.map(el => {
          return {
            ...el,
            isRecommended: listIds.indexOf(el.id) !== -1
          };
        });
        this.openDialog(recommendedTariffs);
      });
    }
  }

  openDialog(tariffs) {
    const options: any = {
      backdrop: 'static',
      windowClass: 'select-nodes-modal'
    }
    const modalRef = this.modalService.open(DialogSelectTariffsComponent, options);
    modalRef.componentInstance.data = {
      tariffs: tariffs
    };
    modalRef.result.then((res: NodeDetailViewModel[]) => {
      this.onConfirmerAction.emit(res);
    }, () => {
    });
  }

  private collectSelectedNodes(nodes: NodeDetailViewModel[]) {
    const nodeIds = [];
    nodes.forEach(node => {
      if (node.tariffApplyType === 0 && node.isSelected) {
        nodeIds.push(node.id);
      } else if (node.tariffApplyType === 1 && node.nodes) {
        node.nodes.forEach(subnode => {
          if (subnode.isSelected) {
            nodeIds.push(subnode.nodeId);
          }
        });
      }

    });
    return nodeIds;
  }

  private mergeTariffs(list1: string[], list2: string[]) {
    const mapData = {};
    list1.forEach(el => {
      mapData[el] = 1;
    });
    list2.forEach(el => {
      if (mapData[el]) {
        mapData[el]++;
      }
    });
    return Object.keys(mapData).filter(el => mapData[el] === 2);
  }

  private colloectTariffsForExcluding(nodes: NodeDetailViewModel[]) {
    let tariffs = null;
    nodes.forEach(node => {
      if (node.tariffApplyType === 0 && node.isSelected) {
        const nodeTariggsIds = node.tariffs.filter(el => !el.nodeId).map(el => el.id);
        if (!tariffs) {
          tariffs = nodeTariggsIds;
        } else {
          tariffs = this.mergeTariffs(tariffs, nodeTariggsIds)
        }
      } else if (node.tariffApplyType === 1 && node.nodes) {
        node.nodes.forEach(subnode => {
          if (subnode.isSelected) {
            const nodeTariggsIds = node.tariffs.filter(el => el.nodeId === subnode.nodeId).map(el => el.id);
            if (!tariffs) {
              tariffs = nodeTariggsIds;
            } else {
              tariffs = this.mergeTariffs(tariffs, nodeTariggsIds)
            }
          }
        });
      }

    });
    return tariffs ? tariffs : [];
  }

  private filterApplicableNodesTariffs(recommendedTariffs) {
    return Object.values(recommendedTariffs).map((nodeTariffs: any[]) => {
      return nodeTariffs.filter(el => el.isApplicable).map(el => el.tariffVerionId);
    });
  }

  private filterTariffsThatAreRecommendedForAllNodes(nodesTariffs, countNodes) {
    const listIds = {};
    for (let i = 0; i < nodesTariffs.length; i++) {
      for (let j = 0; j < nodesTariffs[i].length; j++) {
        const item = nodesTariffs[i][j];
        if (!listIds[item]) {
          listIds[item] = 1;
        } else {
          listIds[item]++;
        }
      }
    }
    return Object.keys(listIds).filter(id => listIds[id] === countNodes);
  }
}
