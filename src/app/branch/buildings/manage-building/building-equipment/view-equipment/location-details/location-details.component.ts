import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {DeleteDialogComponent} from 'app/widgets/delete-dialog/delete-dialog.component';
import {EquipmentViewModel, OrderEquipment} from '../../shared/models';

import * as fromLocationEquipment from '../../shared/store/reducers';
import * as locationEquipmentAction from '../../shared/store/actions/location-equipment.action';
import * as locationStepActions from '../../shared/store/actions/location-step.actions';

import * as replaceWizardAction
  from '../../shared/store/actions/replace-equipment-wizard-actions/replace-wizard.actions';
import * as addClosingReadingsAction
  from '../../shared/store/actions/replace-equipment-wizard-actions/add-closing-readings-step.actions';

import * as wizardAction from '../../shared/store/actions/wizard.actions';

import {map} from 'rxjs/operators';
import {SupplyType} from '@models';
import {ReplaceEquipmentComponent} from '../../replace-equipment/replace-equipment.component';
import * as commonStore from '../../../shared/store/selectors/common-data.selectors';
@Component({
  selector: 'location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.less']
})
export class LocationDetailsComponent implements OnInit, OnDestroy {

  isWizardMode$: Observable<boolean>;

  location$: Observable<any>;
  equipmentList$: Observable<EquipmentViewModel[]>;
  orderIndex$: Observable<number>;

  subscriber$: Subscription;
  nodes$: Observable<any>;
  units$: Observable<any>;

  branchId: string;
  buildingId$: Subscription;
  buildingId: string;
  version: string;
  locationId: string;

  selectedSupplyTypeText$: Observable<string>;
  selectedNodeText$: Observable<string>;
  selectedUnitText$: Observable<string>;

  supplyTypes: SupplyType[] = [SupplyType.Electricity, SupplyType.Gas, SupplyType.Sewerage, SupplyType.Water, SupplyType.AdHoc];
  orderIndex: number = 1;

  supplyType = SupplyType;
  orderType = OrderEquipment;
  buildingPeriodIsFinalized: boolean;

  constructor(
    private modalService: NgbModal,
    private store: Store<fromLocationEquipment.State>,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.location$ = store.select(fromLocationEquipment.getLocationEquipmentDetail);
    this.equipmentList$ = store.select(fromLocationEquipment.getLocationEquipmentEquipmentList);
    this.isWizardMode$ = store.select(fromLocationEquipment.getWizardMode);
    this.nodes$ = store.select(fromLocationEquipment.getLocationEquipmentNodes);
    this.units$ = store.select(fromLocationEquipment.getLocationEquipmentUnits);

    this.selectedSupplyTypeText$ = store.select(fromLocationEquipment.getLocationEquipmentSupplyTypeFilter).pipe(map(s => {

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

    this.selectedNodeText$ = store.select(fromLocationEquipment.getLocationEquipmentNodeFilter).pipe(map(n => {
      return n ? n.name : "All nodes";
    }));

    this.selectedUnitText$ = store.select(fromLocationEquipment.getLocationEquipmentUnitFilter).pipe(map(u => {
      return u ? u.name : "All units";
    }));

    this.orderIndex$ = store.select(fromLocationEquipment.getLocationEquipmentOrder);
  }

  dropped(event: CdkDragDrop<EquipmentViewModel[]>) {
    this.store.dispatch(new locationEquipmentAction.UpdateEquipments({
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex
    }));
  }

  ngOnInit() {
    this.store.dispatch(new wizardAction.CloseWizard());

    const pathFromRoot = this.activatedRoute.pathFromRoot;
    this.subscriber$ = combineLatest(pathFromRoot[2].params, pathFromRoot[4].params, pathFromRoot[5].params, pathFromRoot[7].params)
      .subscribe(([branchParams, buildingParams, versionParams, locationParams]) => {
        this.branchId = branchParams['branchid'];
        this.buildingId = buildingParams['id'];
        this.version = versionParams['vid'];
        this.locationId = locationParams['locationId'];
        this.store.dispatch(new locationEquipmentAction.GetLocation(this.locationId));
      });
    
    this.store.pipe(select(commonStore.getIsFinalized))
      .subscribe(res => {this.buildingPeriodIsFinalized = res});
  }

  ngOnDestroy() {
    this.subscriber$ && this.subscriber$.unsubscribe();
  }

  search(event): void {
    this.store.dispatch(new locationEquipmentAction.UpdateSearchKey(event));
  }

  onAddReplace(event) {
    this.store.dispatch(new replaceWizardAction.ResetWizard());
    this.store.dispatch(new replaceWizardAction.SetWizardLocationAppointment(true));
    this.store.dispatch(new replaceWizardAction.ToggleWizard());
    this.store.dispatch(new addClosingReadingsAction.InitRegisters(event));
    const modalRef = this.modalService.open(ReplaceEquipmentComponent, {
      backdrop: 'static',
      windowClass: 'replace-meter-modal'
    });
  }

  onClone(event) {
    this.store.dispatch(new locationEquipmentAction.CloneEquipmentRequest(event));
  }

  onEdit(event) {
    this.store.dispatch(new locationEquipmentAction.UpdateEquipment(event));
  }

  onDelete(event) {
    const modalRef = this.modalService.open(DeleteDialogComponent, {backdrop: 'static'});
    modalRef.result.then((result) => {
      this.store.dispatch(new locationEquipmentAction.DeleteEquipment(event));
    });
  }

  onPageChange(event) {
    this.store.dispatch(new locationEquipmentAction.UpdatePage(event));
  }

  onUnitChanged(event) {
    this.store.dispatch(new locationEquipmentAction.UpdateUnit(event));
  }

  onNodeChanged(event) {
    this.store.dispatch(new locationEquipmentAction.UpdateNode(event));
  }

  onSupplyTypeChanged(event) {
    this.store.dispatch(new locationEquipmentAction.UpdateSupplyType(event));
  }

  changeOrderIndex(event) {
    if (this.orderIndex == event || (this.orderIndex == (event * -1)))
      this.orderIndex *= -1;
    else
      this.orderIndex = event;

    this.store.dispatch(new locationEquipmentAction.UpdateOrder(this.orderIndex));
  }

  onAddMeter() {
    if(this.buildingPeriodIsFinalized) return false;
    this.store.dispatch(new wizardAction.ResetWizard());
    this.store.dispatch(new wizardAction.WizardLocationAppointment(true));
    this.store.dispatch(new wizardAction.ToggleWizard());
    this.store.dispatch(new locationStepActions.SetLocationData());
  }

  onEditEquipment(event: any, equipment: any) {
    if(this.buildingPeriodIsFinalized) return false;
    if (event.target && (event.target.classList.contains('dropdown-toggle') || (event.target.classList.contains('dropdown-clone'))))
      return;

    this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.version, 'equipment', 'locations', this.locationId, equipment.id]);
  }
}
