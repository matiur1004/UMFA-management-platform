import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable, Subject, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

import {CommonAreaViewModel, EquipmentAttributeViewModel, HistoryViewModel} from '@models';
import {NodeDetailViewModel, NodeTariffApplyType} from '../../../shared/models';

import * as commonData from '../../../../shared/store/selectors/common-data.selectors';
import * as fromNodeState from '../../../shared/store/reducers';
import * as nodeFormAllocatedTariffActions from '../../../shared/store/actions/node-form-allocated-tariffs.actions';
import * as nodeFormActions from '../../../shared/store/actions/node-form.actions';
import {NodeService} from '../../../shared/node.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'allocated-tariffs',
  templateUrl: './allocated-tariffs.component.html',
  styleUrls: ['./allocated-tariffs.component.less']
})
export class AllocatedTariffsComponent implements OnInit, OnDestroy {
  public branchId: string;
  public buildingId: string;
  public versionId: string;
  public version: HistoryViewModel;
  public nodeId: string;
  viewsArrTemp = ['Per nodes totals', 'Per meter Tariffs']
  viewIdx: number = 0;
  public areas$: Observable<CommonAreaViewModel[]>;
  public nodeForm$: Observable<any>;
  public nodeTariffs$: Observable<any[]>;
  public tariffs$: Observable<any[]>;
  public recommendedTariffs$: Observable<any[]>;
  public nodesRecommendedTariffs$: Observable<any[]>;
  public suppliers$: Observable<any[]>;
  public attributes$: Observable<EquipmentAttributeViewModel[]>;
  public node$: Subscription;
  public node: NodeDetailViewModel;
  @Input() buildingPeriodIsFinalized: boolean;
  @Output() delete = new EventEmitter();
  @Output() updateTariffIsBilling = new EventEmitter();
  @Output() updateLineItemIsBilling = new EventEmitter();
  @Output() updateLineItemIsActive = new EventEmitter();
  @Output() updateCategory = new EventEmitter();
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();
  private componentComplete = new Subject();

  constructor(
    private route: ActivatedRoute,
    private store: Store<any>,
    private nodeService: NodeService
  ) {
  }

  ngOnInit() {
    this.store.dispatch(new nodeFormActions.GetRecommendedTariffs());
    combineLatest(
      this.route.pathFromRoot[2].params,
      this.route.pathFromRoot[4].params,
      this.route.pathFromRoot[5].params,
      this.store.pipe(select(commonData.getSelectedHistoryLog)),
      this.route.pathFromRoot[7].params,
      this.store.pipe(select(fromNodeState.getNodeDetail))
    ).subscribe(([branchParams, buildingParams, versionParams, versionData, nodeParams, nodeDetails]) => {
      this.branchId = branchParams['branchid'];
      this.buildingId = buildingParams['id'];
      this.versionId = versionParams['vid'];
      this.nodeId = nodeParams['nodeId'];
      this.node = nodeDetails;
      this.version = versionData;
      this.onLoadData();
    }, takeUntil(this.componentComplete));

    this.nodeForm$ = this.store.pipe(select(fromNodeState.getNodeForm));
    this.recommendedTariffs$ = this.store.pipe(select(fromNodeState.getNodeFormAllocatedRecommendedTariffs));
    this.suppliers$ = this.store.pipe(select(fromNodeState.getSuppliesLocationTypes));
    this.attributes$ = this.store.pipe(select(commonData.getAttributes));
    this.tariffs$ = this.store.pipe(select(fromNodeState.getNodeDetailTariffs));
    this.nodeTariffs$ = this.store.pipe(select(fromNodeState.getNodeFormAllocatedTariffTariffs));
  }

  ngOnDestroy() {
    this.componentComplete.next();
    this.componentComplete.complete();
  }

  onLoadData() {
    const versionId = this.version ? this.version.id : null;
    this.store.dispatch(new nodeFormActions.GetTariffs({versionId: versionId}));

    if (this.version && this.version.id && this.node && this.node.id) {
      const version = this.version;
      this.viewIdx = this.node.tariffApplyType;
      let nodeIds = [];
      if (this.node.nodes) {
        nodeIds = this.node.nodes.map(el => el.nodeId);
      }
      this.nodesRecommendedTariffs$ = this.nodeService.getRecomendedCategoriesForTariffsByNode(this.buildingId, version.id, nodeIds);
    }
  }

  changeView(idx: number) {
    this.viewIdx = idx;
  }

  onApplyNewTariff(ev) {
    this.store.dispatch(new nodeFormAllocatedTariffActions.SelectTariffVersion(ev.id));
    this.store.dispatch(new nodeFormAllocatedTariffActions.ApplyNewTariff({isRecommended: ev.isRecommended}));
  }

  onCancel() {
    this.store.dispatch(new nodeFormActions.ResetNodeDetailChanges());
  }

  onSavePerNodeTariffs($event) {
    const version = $event.version;
    this.store.dispatch(new nodeFormAllocatedTariffActions.SaveTariffs({
      tariffApplyType: NodeTariffApplyType.PerNode,
      version: version
    }));
  }

  onUpdatedTariffsList($event) {
    const tariffs = $event.tariffs;
    this.store.dispatch(new nodeFormAllocatedTariffActions.SetNodeTariffs(tariffs));
  }

  onSavePerMetersTariffs($event) {
    const tariffs = $event.tariffs;
    const version = $event.version;
    this.store.dispatch(new nodeFormAllocatedTariffActions.SetNodeTariffs(tariffs));
    this.store.dispatch(new nodeFormAllocatedTariffActions.SaveTariffs({
      tariffApplyType: NodeTariffApplyType.PerMeter,
      version: version
    }));
  }

  onDeleteTariff(event) {
    this.store.dispatch(new nodeFormAllocatedTariffActions.DeleteTariff(event));
  }

  onUpdateTariffIsBilling(event) {
    this.store.dispatch(new nodeFormAllocatedTariffActions.UpdateTariffIsBilling(event));
  }

  onUpdateLineItemIsBilling(event) {
    this.store.dispatch(new nodeFormAllocatedTariffActions.UpdateLineItemIsBilling(event));
  }

  onUpdateLineItemIsActive(event) {
    this.store.dispatch(new nodeFormAllocatedTariffActions.UpdateLineItemIsActive(event));
  }

  onUpdateCategory(event) {
    this.store.dispatch(new nodeFormAllocatedTariffActions.UpdateLineItemCategory(event));
  }

}
