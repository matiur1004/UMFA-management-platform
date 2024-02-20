import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {combineLatest, forkJoin, Observable, Subscription} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';

import {SearchFilterModel} from '../../shared/models/search-filter.model';
import {NodeDetailViewModel, NodeSetsViewModel} from '../../shared/models';
import {HistoryViewModel} from '@models';

import {NodeSetsService} from '../../shared/node-sets.service';
import {NodeService} from '../../shared/node.service';
import {MeterService} from '../../shared/meter.service';
import {EquipmentService} from '@services';

import {PopupCommentComponent} from 'app/popups/popup.comment/popup.comment.component';

import * as fromNode from '../../shared/store/reducers';
import * as commonDataActions from '../../../shared/store/actions/common-data.action';
import * as commonData from '../../../shared/store/selectors/common-data.selectors';

@Component({
  selector: 'page-edit-node-set',
  templateUrl: './page-edit-node-set.component.html',
  styleUrls: ['./page-edit-node-set.component.less']
})
export class PageEditNodeSetComponent implements OnInit, OnDestroy {
  public setId: string;
  public model: NodeSetsViewModel;
  public listOfNodes = [];
  buildingId: string;
  branchId: string;
  selectedVersion$: Subscription;
  nodesSubscription: Subscription;
  selectedVersion: HistoryViewModel;
  public nodes: NodeDetailViewModel[] = [];
  public filter: SearchFilterModel;
  public shops: any[];
  public tariffs: any[];
  public attributes: any[];
  public suppliers: any[];
  public areas: any[];
  public recommendedTariffs: any[];
  public billingFilter = '';
  private subscriber$: Subscription;

  constructor(
    private store: Store<fromNode.State>,
    private router: Router,
    private route: ActivatedRoute,
    private nodeSetsService: NodeSetsService,
    private nodeService: NodeService,
    private meterService: MeterService,
    private equipmentService: EquipmentService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.subscriber$ = combineLatest(
      this.route.pathFromRoot[2].params,
      this.route.pathFromRoot[4].params,
      this.route.pathFromRoot[5].params,
      this.route.pathFromRoot[7].params
    ).subscribe(([branchParams, buildingParams, versionParams, setParams]) => {
      this.branchId = branchParams['branchid'];
      this.buildingId = buildingParams['id'];
      this.selectedVersion$ && this.selectedVersion$.unsubscribe();
      this.selectedVersion$ = this.store.pipe(select(commonData.getSelectedHistoryLog)).subscribe(versionItem => this.selectedVersion = versionItem);
      this.setId = setParams['setId'];
      this.loadSetItem();
    });


  }

  ngOnDestroy() {
    this.selectedVersion$ && this.selectedVersion$.unsubscribe();
    this.subscriber$ && this.subscriber$.unsubscribe();
    this.nodesSubscription?.unsubscribe();
  }

  loadSetItem() {
    this.nodeSetsService.getNodeSet(this.buildingId, this.setId, this.selectedVersion.id).subscribe(nodeSet => {
      this.model = nodeSet;
      this.loadNodesForSet(this.model.nodeIds);
    });
  }

  loadNodesForSet(listIds: string[]) {
    this.nodesSubscription = forkJoin([
      this.nodeService.getAllBulkNodesByBuilding(this.buildingId, this.selectedVersion.id, this.model.supplyType, listIds),
      this.meterService.getShops(this.buildingId, this.selectedVersion.id),
      this.nodeService.getTariffsForBuilding(this.buildingId, this.model.supplyType, this.selectedVersion.id),
      this.equipmentService.getAllEquipmentAttributes(''),
      this.meterService.getSupplies(this.buildingId, this.model.supplyType),
      this.meterService.getCommonAreas(this.buildingId, this.selectedVersion.id),
      this.loadRecommendedTariffs(listIds)
    ]).subscribe(([bulkNodes, shops, tariffs, equipmentAttributes, suppliers, commonAreas, recommendedTariffs]) => {
      this.nodes = bulkNodes.filter(el => listIds.indexOf(el.id) !== -1);
      this.shops = shops;
      this.tariffs = tariffs;
      this.attributes = equipmentAttributes;
      let filteredSuppliers = suppliers.map((supplier) => {
        return {
          id: supplier.id,
          name: supplier.name,
          locationTypes: supplier.supplyTypes.reduce((locationTypes, supplyType) => {
            locationTypes.push(...supplyType.supplyToLocations);
            return locationTypes;
          }, [])
        }
      });
      this.suppliers = filteredSuppliers;
      this.areas = shops.map(shop => ({id: shop.id, name: shop.name}))
        .concat(commonAreas.map(commonArea => ({id: commonArea.id, name: commonArea.name})));
      this.recommendedTariffs = recommendedTariffs;
    });
  }

  loadRecommendedTariffs(nodeIds): Observable<any[]> {
    return this.nodeService.getRecomendedCategoriesForTariffsByNode(this.buildingId, this.selectedVersion.id, nodeIds);
  }

  onSearch(ev: SearchFilterModel) {
    this.filter = ev;
  }

  onNewNodesSelected(ev) {
    const nodes = this.nodes.concat(ev);
    const newNodeIds = nodes.map(el => el.id);
    this.loadRecommendedTariffs(newNodeIds).subscribe(res => {
      this.recommendedTariffs = res;
      this.nodes = nodes;
      this.model.nodeIds = [].concat(this.model.nodeIds, newNodeIds);
    });
  }

  onDeleteNode(ev: NodeDetailViewModel) {
    this.nodes = this.nodes.filter(node => node.id !== ev.id);
    this.model.nodeIds = this.model.nodeIds.filter(id => id !== ev.id);
  }

  openSavePopup() {
    const modalRef = this.modalService.open(PopupCommentComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });

    modalRef.componentInstance.date = new Date();
    modalRef.componentInstance.comment = 'Save Set';

    return modalRef;
  }

  onNodeSetUpdated(ev) {
    const modalRef = this.openSavePopup();
    modalRef.result.then(({comment, date, actionType}) => {
      const params = {
        entity: this.model,
        id: this.selectedVersion.id,
        comment: comment,
        action: actionType,
        majorVersion: 1
      };
      if (date) {
        params['versionDate'] = new Date(date);
      }

      this.nodeSetsService.updateNodeSet(this.buildingId, params).subscribe(res => {
        if (this.model.nodeIds.length) {
          this.saveNodes(res.current.id, comment, actionType, params['versionDate']);
        } else {
          this.updateCurrentSetVersion(res);
        }
      });
    }, () => {
    });
  }

  saveNodes(versionId, comment, actionType, date) {
    const param: any = {
      entity: this.nodes.map(el => {
        const node = {
          ...el,
          meterAllocation: el.meterAllocation ? {
            ...el.meterAllocation,
            registers: el.meterAllocation.allocatedRegisters
          } : null,
          nodes: el.nodes ? el.nodes.map(n => ({...n, registers: n.allocatedRegisters})) : null
        };
        delete node.isSelected;
        return node;
      }),
      comment: comment,
      id: versionId,
      action: actionType,
      versionDate: date
    };
    this.nodeService.updateAllBulkNodesByBuilding(this.buildingId, param).subscribe(res => {
      this.updateCurrentSetVersion(res);
    });
  }

  updateCurrentSetVersion(res) {
    this.store.dispatch(new commonDataActions.UpdateUrlVersionAction(res.current.versionDate));
    this.store.dispatch(new commonDataActions.GetHistoryWithVersionId(res.current.id));
  }

  onCancel() {
    this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.selectedVersion.versionDay, 'equipment', 'nodes']);
  }
}
