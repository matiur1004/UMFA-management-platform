import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeleteDialogComponent} from 'app/widgets/delete-dialog/delete-dialog.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {NodeSetsViewModel, NodeType, NodeViewModel, OrderNodeType} from '../../shared/models';
import {SupplyType, UNITS_PER_PAGE} from '@models';
import {BranchManagerService} from '@services';

import * as fromNode from '../../shared/store/reducers';
import * as buildingCommonData from '../../../shared/store/selectors/common-data.selectors';
import * as nodeAction from '../../shared/store/actions/node.actions';

import * as nodeSetsAction from '../../shared/store/actions/node-sets.actions';
import {NodeSetsService} from '../../shared/node-sets.service';

@Component({
  selector: 'equipment-nodes',
  templateUrl: './equipment-nodes.component.html',
  styleUrls: ['./equipment-nodes.component.less']
})
export class EquipmentNodesComponent implements OnInit, OnDestroy {

  nodeList$: Observable<NodeViewModel[]>;
  nodeSetsList$: Observable<NodeSetsViewModel[]>;//NodeSetsViewModel
  page$: Observable<number>;
  totalCount$: Observable<number>;
  unitsPerPage$: Observable<number>;

  selectedSupplyTypeText$: Observable<string>;
  selectedNodeTypeText$: Observable<string>;
  selectedUnitsPerPageText$: Observable<string>;


  nodeType = NodeType;
  supplyType = SupplyType;

  buildingId$: Subscription;
  selectedVersionId$: Subscription;
  selectedVersionId: string;

  buildingId: string;
  branchId: string;

  supplyTypes: SupplyType[] = [SupplyType.Electricity, SupplyType.Water, SupplyType.Gas, SupplyType.Sewerage, SupplyType.AdHoc];
  nodeTypes: NodeType[] = [NodeType.Single, NodeType.Multi];
  unitsPerPage: number[] = UNITS_PER_PAGE;

  orderType = OrderNodeType;

  orderIndex: number = 1;
  searchKey$: Observable<string>;
  buildingPeriodIsFinalized: boolean;

  constructor(
    private store: Store<fromNode.State>,
    private modalService: NgbModal,
    private router: Router,
    private nodeSetsService: NodeSetsService,
    private branchManager: BranchManagerService
  ) {
    this.store.dispatch(new nodeAction.ResetForm());

    this.nodeSetsList$ = store.pipe(select(fromNode.getNodeSets));
    this.nodeList$ = store.pipe(select(fromNode.getNodes));
    this.totalCount$ = store.pipe(select(fromNode.getNodeTotal));
    this.page$ = store.pipe(select(fromNode.getNodePage));
    this.unitsPerPage$ = store.pipe(select(fromNode.getNodeUnitsPerPage));
    this.searchKey$ = store.pipe(select(fromNode.getNodeSearchKey));

    this.selectedNodeTypeText$ = store.pipe(select(fromNode.getNodeTypeFilter),
      map(n => {
        switch (n) {
          case NodeType.Single:
            return 'Only single';

          case NodeType.Multi:
            return 'Only multi';

          default:
            return 'All types';
        }
      }));

    this.selectedSupplyTypeText$ = store.pipe(select(fromNode.getNodeSupplyTypeFilter), map(s => {
      switch (s) {
        case SupplyType.Electricity:
          return 'Electricity';

        case SupplyType.Gas:
          return 'Gas';

        case SupplyType.Sewerage:
          return 'Sewerage';

        case SupplyType.Water:
          return 'Water';

        case SupplyType.AdHoc:
          return 'Ad hoc';

        default:
          return 'All supply types';
      }
    }));

    this.selectedUnitsPerPageText$ = store.pipe(select(fromNode.getNodeUnitsPerPage), map(u => {
      return u ? u.toString() : 'All';
    }));

    this.buildingId$ = store.pipe(select(buildingCommonData.getBuildingId)).subscribe(id => this.buildingId = id);

    this.selectedVersionId$ = store.pipe(select(buildingCommonData.getSelectedHistoryLog)).subscribe(v => {
      this.selectedVersionId = v && v.versionDay;
      this.loadData();
    });
  }

  ngOnInit() {
    this.branchId = this.branchManager.getBranchId();

    this.store.pipe(select(buildingCommonData.getIsFinalized))
      .subscribe(res => {this.buildingPeriodIsFinalized = res});
  }

  loadData() {
    this.store.dispatch(new nodeAction.RequestNodeList());
    this.store.dispatch(new nodeSetsAction.RequestNodeSetsList());
  }

  ngOnDestroy(): void {
    this.buildingId$.unsubscribe();
    this.selectedVersionId$.unsubscribe();
  }

  search(term: string): void {
    this.store.dispatch(new nodeAction.UpdateSearchKey(term));
  }

  onDelete(event) {
    const modalRef = this.modalService.open(DeleteDialogComponent, {backdrop: 'static'});
    modalRef.result.then((result) => {
      this.store.dispatch(new nodeAction.DeleteNode(event));
    }, () => {
    });
  }

  onSupplyTypeChanged(value: number) {
    this.store.dispatch(new nodeAction.UpdateSupplyTypeFilter(value));
  }

  onNodeTypeChanged(value: number) {
    this.store.dispatch(new nodeAction.UpdateNodeTypeFilter(value));
  }

  onUnitsPerPageChanged(value: any) {
    this.store.dispatch(new nodeAction.UpdateUnitsPerPage(value));
  }

  onPageChanged(value: number) {
    this.store.dispatch(new nodeAction.UpdatePage(value));
  }

  changeOrderIndex(idx) {
    if (this.orderIndex == idx || (this.orderIndex == (idx * -1))) {
      this.orderIndex *= -1;
    } else {
      this.orderIndex = idx;
    }

    this.store.dispatch(new nodeAction.UpdateOrder(this.orderIndex));
  }

  onOpenNodeDetail(event: any, node: any) {
    if (event.target && (event.target.classList.contains('dropdown-toggle') || (event.target.classList.contains('dropdown-delete')))) {
      return;
    }

    this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.selectedVersionId, 'equipment', 'nodes', node.id]);
  }

  onCreateNode() {
    if(this.buildingPeriodIsFinalized) return false;
    this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.selectedVersionId, 'equipment', 'nodes', 'new']);
  }

  onDeleteNodeSet(setId: string) {
    this.store.dispatch(new nodeSetsAction.DeleteNode(setId));
  }

  useCompactViewForEquipmentGroups(equipmentGroupsValue: string): boolean {
    return this.getStringValueRowsCount(equipmentGroupsValue) < 4;
  }

  getStringValueRowsCount(strValue: string): number {
    if (!strValue)
      return 1;
    return (strValue.match(new RegExp("\n", "g")) || []).length + 1;
  }
}
