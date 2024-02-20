import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SupplyType, TotalRegister} from '@models';
import {NgbModal, NgbNav} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {BranchManagerService} from '@services';
import {PopupCommentComponent} from 'app/popups/popup.comment/popup.comment.component';
import {MarkAsSubmittedAction} from 'ngrx-forms';
import {combineLatest, Observable, of, Subject} from 'rxjs';
import {map, takeUntil, withLatestFrom} from 'rxjs/operators';
import * as buildingCommonData from '../../../shared/store/selectors/common-data.selectors';
import {
  NodeDetailViewModel,
  NodeType,
  NodeViewModel,
  OrderEquipment,
  SelectedStatusFilter,
  SelectedUnitFilter,
  UnitFilter
} from '../../shared/models';
import * as nodeFormActions from '../../shared/store/actions/node-form.actions';
import * as nodeActions from '../../shared/store/actions/node.actions';

import * as fromNodeState from '../../shared/store/reducers';
import {InitMeterState} from '../../shared/store/reducers/node-form-allocated-equipment.store';
import {InitState} from '../../shared/store/reducers/node-form.store';
import * as nodeAction
  from '@app/branch/buildings/manage-building/building-equipment/shared/store/actions/node.actions';

@Component({
  selector: 'node-details',
  templateUrl: './node-details.component.html',
  styleUrls: ['./node-details.component.less']
})
export class NodeDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('nav', { static: true }) tabSet: NgbNav;

  form$: Observable<any>;
  node$: Observable<NodeDetailViewModel>;
  nodeList$: Observable<NodeViewModel[]>;

  allowedChildNodesFiltered$: Observable<any>;
  supplies$: Observable<any>;
  locationTypes$: Observable<any>;
  suppliesNames$: Observable<any>;
  locationTypesNames$: Observable<any>;
  hasCostReceiverTariff$: Observable<boolean>;
  costReceiverTariffs$: Observable<string[]>;
  allocatedNodes$: Observable<any[]>;
  allocatedEquipmentCount$: Observable<number>;
  allocatedNodesDict$: Observable<{ [key: string]: any }>;
  allocatedNodesForm$: Observable<any>;
  showNodesAllocation$: Observable<boolean>;
  registers$: Observable<any[]>;
  selectedRegister$: Observable<TotalRegister[]>;
  totalRegister$: Observable<TotalRegister[]>;
  selectedStatus$: Observable<SelectedStatusFilter>;
  totalCount: Observable<number>;
  allowedChildrenRegisters$: Observable<any>;
  selectedAddEquipmentRegisterText$: Observable<string>;
  isSelectedAllMeters$: Observable<boolean>;
  totalThreePhasesAmperage$: Observable<number>;
  totalOnePhaseAmperage$: Observable<number>;
  nodeId: string;
  buildingId: string;
  versionId: string;
  branchId: string;
  selectedRegisterId: string;
  orderIndex: number = 2;
  orderType = OrderEquipment;
  supplyType = SupplyType;

  // shops
  units$: Observable<any[]>;
  unitsCount$: Observable<number>;
  selectedUnitFilterText$: Observable<string>;
  specials$: Observable<any[]>;
  selectedUnitFilter = SelectedUnitFilter;

  comment: string;

  nodeAttributeValues$: Observable<any[]>;

  destroyed = new Subject();
  restrictedTabs: { [key: string]: boolean };
  meterAllocation$: Observable<any[]>;
  smnRegisters$: Observable<any[]>;

  currentIndex: number = -1;
  nodeList: NodeViewModel[] = [];

  subscriber$: any;
  version: string;
  locationId: string;
  nodeListUrl: any[];
  buildingPeriodIsFinalized$: Observable<any>;
  
  tabId: string = "equipment"
  constructor(
    private store: Store<fromNodeState.State>,
    private modalService: NgbModal,
    private router: Router,
    private branchManager: BranchManagerService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.nodeList$ = store.pipe(select(fromNodeState.getNodes));
    this.nodeList$.subscribe(res => {
      this.nodeList = res;
    })
    this.node$ = this.store.pipe(select(fromNodeState.getNodeDetail));
    this.showNodesAllocation$ = this.store.pipe(select(fromNodeState.getNodesAllocationVilibility));
    this.form$ = this.store.pipe(select(fromNodeState.getNodeForm));
    this.supplies$ = this.store.pipe(select(fromNodeState.getNodeFormEquipmentSupplies));
    this.locationTypes$ = this.store.pipe(select(fromNodeState.getNodeFormEquipmentLocationsTypes));
    this.suppliesNames$ = this.store.pipe(select(fromNodeState.getSuppliesNames));
    this.locationTypesNames$ = this.store.pipe(select(fromNodeState.getSuppliesLocationTypeNames));
    this.hasCostReceiverTariff$ = this.store.pipe(select(fromNodeState.getHasCostReceiverTariffStatus));
    this.costReceiverTariffs$ = this.store.pipe(select(fromNodeState.getHasCostReceiverTariffs));
    this.totalRegister$ = this.store.pipe(select(fromNodeState.getTotalRegisters));

    this.allocatedNodes$ = this.store.pipe(select(fromNodeState.getNodeFormAllocatedNodesSorted));
    this.meterAllocation$ = this.store.pipe(select(fromNodeState.getMeterAllocationForm));
    this.allocatedEquipmentCount$ = combineLatest(this.node$, this.allocatedNodes$).pipe(
      map(([n, children]) => n.nodeType === NodeType.Single ? 1 : ((children && children.length) || 0)));
    this.allocatedNodesDict$ = this.store.pipe(select(fromNodeState.getAllocatedNodesDict));
    this.allocatedNodesForm$ = this.store.pipe(select(fromNodeState.getNodeFormAllocatedEquipmentForm));

    this.registers$ = this.store.pipe(select(fromNodeState.getNodeFormAllocatedEquipmentRegisters));
    this.smnRegisters$ = this.store.pipe(select(fromNodeState.getSingleNodeFormAllocatedEquipmentRegisters));
    this.selectedRegister$ = this.store.pipe(select(fromNodeState.getNodeFormAllocatedEquipmentRegisterFilter));
    this.selectedStatus$ = this.store.pipe(select(fromNodeState.getNodeFormAllocatedEquipmentRegisterStatus));

    this.allowedChildNodesFiltered$ = this.store.pipe(select(fromNodeState.getNodeAllowedChildrenFiltered));
    this.allowedChildrenRegisters$ = this.store.pipe(select(fromNodeState.getNodeFormAllowedChildrenRegisters));
    this.selectedAddEquipmentRegisterText$ = this.store.pipe(select(fromNodeState.getNodeFormAddEquipmentRegisterFilter),
      map(r => r ? r.name : 'All registers'));

    this.totalOnePhaseAmperage$ = this.store.pipe(select(fromNodeState.getNodeFormAllocatedEquipmentTotalOnePhaseAmperage));
    this.totalThreePhasesAmperage$ = this.store.pipe(select(fromNodeState.getNodeFormAllocatedEquipmentTotalThreePhasesAmperage));

    //shops
    this.units$ = this.store.pipe(select(fromNodeState.getNodeFormAllocatedUnitFilteredUnits));
    this.unitsCount$ = this.store.pipe(select(fromNodeState.getNodeFormAllocatedUnitsCount));
    this.selectedUnitFilterText$ = this.store.pipe(select(fromNodeState.getNodeFormAllocatedUnitShopFilter),
      map(filter => {
        switch (filter) {
          case UnitFilter.AllUnits:
            return this.selectedUnitFilter.ALL_UNITS;
          case UnitFilter.AllShops:
            return this.selectedUnitFilter.ALL_SHOPS;
          case UnitFilter.AllCommonAreas:
            return this.selectedUnitFilter.ALL_COMMON_AREAS;
          case UnitFilter.ConnectedUnits:
            return this.selectedUnitFilter.CONNECTED_UNITS;
          case UnitFilter.NotConnectedUnits:
            return this.selectedUnitFilter.NOT_CONNECTED_UNITS;
        }
      }));

    store.pipe(select(buildingCommonData.getSelectedHistoryLog), takeUntil(this.destroyed)).subscribe(log => {
      this.comment = log ? log.comment : '';
    });

    store.pipe(select(buildingCommonData.getBuildingId), takeUntil(this.destroyed)).subscribe(buildingId => {
      this.buildingId = buildingId;
    });

    store.pipe(select(buildingCommonData.getSelectedHistoryLog), takeUntil(this.destroyed)).subscribe(v => {
      this.versionId = v && v.versionDay;
    });

    this.branchId = this.branchManager.getBranchId();

    store.pipe(select(fromNodeState.getNodeDetailTabsDataRestrictions), takeUntil(this.destroyed)).subscribe(data => {
      this.restrictedTabs = data;
    });
    store.pipe(select(fromNodeState.getNodeDetailTab), takeUntil(this.destroyed)).subscribe(tab => {
      if (this.tabSet && this.tabSet.activeId !== tab) {
        this.tabSet.select(tab);
      }
    });

    this.nodeAttributeValues$ = this.store.pipe(select(fromNodeState.getNodeDetailAttributeValues));
  }

  ngOnInit() {
    this.store.dispatch(new nodeActions.GetAllowedChildrenForNode({nodeId: this.nodeId}));
    this.store.dispatch(new nodeActions.GetSuppliesRequest());
    this.store.dispatch(new nodeFormActions.GetTariffs());

    const pathFromRoot = this.activatedRoute.pathFromRoot;
    const nodeParams = pathFromRoot[7].params;

    this.subscriber$ = combineLatest([pathFromRoot[2].params, pathFromRoot[4].params, pathFromRoot[5].params, nodeParams])
      .subscribe(([branchParams, buildingParams, versionParams, nodeParams]) => {
        this.branchId = branchParams["branchid"];
        this.buildingId = buildingParams["id"];
        this.version = versionParams["vid"];
        this.nodeId = nodeParams["nodeId"];
        this.nodeListUrl = ['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.versionId, 'equipment', 'nodes'];
        this.currentIndex = this.nodeList.findIndex(node => node.id == this.nodeId);
      });
    
    this.buildingPeriodIsFinalized$ = this.store.pipe(select(buildingCommonData.getIsFinalized));
  }

  ngOnDestroy(): void {
    // Reset Units and Shops after destroy
    this.store.dispatch(new nodeAction.ResetUnits());
    this.destroyed.next();
    this.destroyed.complete();
    this.store.dispatch(new nodeActions.ToggleAddChildNodesDisplay({show: false}));
  }

  onSearch(event) {
    this.store.dispatch(new nodeFormActions.UpdateSearchKey(event));
  }

  onSearchMeter(event) {
    this.store.dispatch(new nodeFormActions.UpdateMeterSearchKey(event));
  }

  onSupplyChanged(event) {
    this.store.dispatch(new nodeFormActions.UpdateSupplyTo(event));
  }

  onLocationTypeChanged(event) {
    this.store.dispatch(new nodeFormActions.UpdateLocationType(event));
  }

  onRemoveNode(event) {
    this.store.dispatch(new nodeFormActions.RemoveNode(event));
  }

  onRemoveSelectedNodes(event) {
    this.store.dispatch(new nodeFormActions.RemoveSelectedNodes(event));
  }

  onRemoveSelectedRegisters(event) {
    this.store.dispatch(new nodeFormActions.RemoveNodeRegisters(event));
  }

  onAddSelectedRegisters(event) {
    this.store.dispatch(new nodeFormActions.AddNodeRegisters(event));
  }

  onChangeOrderIndex(event) {
    this.store.dispatch(new nodeFormActions.UpdateOrder(event));
  }

  onChangeMeterOrderIndex(event) {
    this.store.dispatch(new nodeFormActions.UpdateMeterOrder(event));
  }

  onRegisterFilterChanged(event) {
    this.store.dispatch(new nodeFormActions.UpdateRegisterFilter(event));
  }

  onMeterRegisterFilterChanged(event) {
    this.store.dispatch(new nodeFormActions.UpdateMeterRegisterFilter(event));
  }

  onStatusChanged(event) {
    this.store.dispatch(new nodeFormActions.UpdateStatusFilter(event));
  }

  onToggleNodeAllocation(event) {
    this.store.dispatch(new nodeActions.ToggleNodeAllocation(event));
  }

  selectNodes(event) {
    this.store.dispatch(new nodeFormActions.SelectNodes(event));
  }

  onToggleUnit(event) {
    this.store.dispatch(new nodeFormActions.ToggleUnit(event));
  }

  onChangeShopOrderIndex(event) {
    this.store.dispatch(new nodeFormActions.UpdateShopOrder(event));
  }

  onUpdateShopFilter(event) {
    this.store.dispatch(new nodeFormActions.UpdateShopFilter(event));
  }

  onSearchShop(event) {
    this.store.dispatch(new nodeFormActions.UpdateShopSearchKey(event));
  }

  onCancel() {
    this.store.dispatch(new nodeFormActions.ResetNodeDetailChanges());
  }

  onSaveAllocatedUnits() {
    let modalRef = this.openSavePopup();

    modalRef.result.then(({comment, date, actionType}) => {
      this.store.dispatch(new nodeFormActions.SaveUnits({
        comment: comment, date: date, actionType: actionType
      }));
    }, () => {
    });
  }

  onSaveAllocatedEquipments() {
    of(null).pipe(withLatestFrom(this.allocatedNodesForm$, (_, f) => f)).subscribe(f => {
      if (!f.isValid) {
        this.store.dispatch(new MarkAsSubmittedAction(InitMeterState.id));
      } else {
        let modalRef = this.openSavePopup();

        modalRef.result.then(({comment, date, actionType}) => {

          this.store.dispatch(new nodeFormActions.SaveAllocatedNodes({
            comment: comment, date: date, actionType: actionType
          }));
        }, () => {
        });
      }
    });
  }

  onSaveCostTariff(event) {
    this.store.dispatch(new nodeFormActions.UpdateCostTariff(event));
    this.onSave();
  }

  onSave() {
    of(null).pipe(withLatestFrom(this.form$, (_, f) => f)).subscribe(f => {
      if (!f.isValid) {
        this.store.dispatch(new MarkAsSubmittedAction(InitState.id));
      } else {
        let modalRef = this.openSavePopup();

        modalRef.result.then(({comment, date, actionType}) => {

          this.store.dispatch(new nodeFormActions.SaveNodeDetail({
            comment: comment, date: date, actionType: actionType
          }));
        }, () => {
        });
      }
    });
  }

  openSavePopup() {
    const modalRef = this.modalService.open(PopupCommentComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });

    modalRef.componentInstance.date = new Date();
    modalRef.componentInstance.comment = this.comment;

    return modalRef;
  }

  trackById(index) {
    return index;
  }

  onOpenNodesAllocation(event) {
    this.store.dispatch(new nodeActions.OpenNodesAllocationView());
  }

  onToggleNodesAllocationView(event) {
    this.store.dispatch(new nodeActions.ToggleAddChildNodesDisplay({show: event}));
  }

  navigateToEquipment(id) {
    this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.versionId, 'equipment', id]);
  }

  changeTab($event) {
    if (this.restrictedTabs[$event.nextId]) {
      $event.preventDefault();
      switch ($event.nextId) {
        case 'units':
          this.store.dispatch(new nodeActions.TryOpenUnitAllocation());
          break;
        default:
          break;
      }
    } else {
      this.store.dispatch(new nodeActions.OpenTab($event.nextId));
    }
  }

  onNodeAttributesChanged(ev) {
    this.store.dispatch(new nodeFormActions.SetNodeAttributes(ev));
  }

  onCancelAllocatedEquipments() {
    this.store.dispatch(new nodeActions.AllocatedEquipmentCancelClick());
  }

  onRegistersFactorCahnged(event) {
    this.store.dispatch(new nodeFormActions.SetNodeRegistersCalculationFactor(event));
  }

  onPrevNode() {
    this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.versionId, 'equipment', 'nodes', this.nodeList[this.currentIndex - 1]['id']]);
  }

  onNextNode() {
    this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.versionId, 'equipment', 'nodes', this.nodeList[this.currentIndex + 1]['id']]);
  }
}
