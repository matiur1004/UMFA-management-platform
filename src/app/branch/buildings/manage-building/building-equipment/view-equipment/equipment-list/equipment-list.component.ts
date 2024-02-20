import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {combineLatest, Observable, of, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {OrderMeter} from '../../shared/models';
import {ReplaceEquipmentComponent} from '../../replace-equipment/replace-equipment.component';

import * as fromEquipment from '../../shared/store/reducers';
import * as bulkWizardSelectors
  from '../../shared/store/reducers/bulk-equipment-wizard-reducers/selectors/bulk-wizard.selectors';
import * as equipmentActions from '../../shared/store/actions/equipment.actions';
import * as locationActions from '../../shared/store/actions/location.actions';
import * as locationStepActions from '../../shared/store/actions/location-step.actions';

import * as wizardAction from '../../shared/store/actions/wizard.actions';
import * as bulkWizardAction from '../../shared/store/actions/bulk-equipment-wizard-actions/bulk-wizard.actions';
import * as replaceWizardAction
  from '../../shared/store/actions/replace-equipment-wizard-actions/replace-wizard.actions';
import * as addClosingReadingsAction
  from '../../shared/store/actions/replace-equipment-wizard-actions/add-closing-readings-step.actions';
import * as buildingCommonData from '../../../shared/store/selectors/common-data.selectors';

import {map, switchMap} from 'rxjs/operators';
import {SupplyType} from '@models';
import {NotificationService} from '@services';

@Component({
  selector: 'equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.less']
})
export class EquipmentListComponent implements OnInit, OnDestroy {

  isWizardMode$: Observable<boolean>;
  isBulkWizardMode$: Observable<boolean>;

  equipmentList$: Observable<any[]>;

  nodes$: Observable<any>;
  units$: Observable<any>;
  locations$: Observable<any>;
  supplyTypes$: Observable<any>;

  searchKey$: Observable<string>;
  selectedSupplyTypeText$: Observable<string>;
  selectedNodeText$: Observable<string>;
  selectedUnitText$: Observable<string>;
  selectedLocationText$: Observable<string>;

  location$: Subscription;
  locationList$: Observable<any[]>;
  locationList: any[] = [];
  locationId: string;

  subscriber$: any;
  branchId: string;
  buildingId: string;
  version: string;

  orderIndex: number = 1;
  supplyType = SupplyType;
  orderType = OrderMeter;
  selectedLog$: Subscription;

  buildingPeriodIsFinalized: boolean;

  constructor(
    private modalService: NgbModal,
    private notificationService: NotificationService,
    private store: Store<fromEquipment.State>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.store.dispatch(new locationActions.RequestLocationList());
    this.store.dispatch(new equipmentActions.ResetForm());
    this.searchKey$ = store.select(fromEquipment.getEquipmentSearchKey);
    this.locationList$ = store.select(fromEquipment.getLocations);
    this.locationList$.subscribe(res => {
      this.locationList = res;
    })
    this.equipmentList$ = store.select(fromEquipment.getEquipmentList);

    this.isWizardMode$ = store.select(fromEquipment.getWizardMode);
    this.isBulkWizardMode$ = store.select(bulkWizardSelectors.getWizardMode);
    this.nodes$ = store.select(fromEquipment.getEquipmentNodes);
    this.units$ = store.select(fromEquipment.getEquipmentUnits);
    this.locations$ = store.select(fromEquipment.getEquipmentLocations);
    this.supplyTypes$ = store.select(fromEquipment.getEquipmentSupplyTypes);

    this.subscriber$ = combineLatest(this.route.pathFromRoot[2].params, this.route.pathFromRoot[4].params, this.route.pathFromRoot[5].params)
      .subscribe(([branchParams, buildingParams, versionParams]) => {
        this.branchId = branchParams['branchid'];
        this.buildingId = buildingParams['id'];
        this.version = versionParams['vid'];
      });

    this.selectedSupplyTypeText$ = store.select(fromEquipment.getEquipmentSupplyTypeFilter).pipe(map(s => {
      return s ? s.name : "All supply types";
    }));

    this.selectedNodeText$ = store.select(fromEquipment.getEquipmentNodeFilter).pipe(map(n => {
      return n ? n.name : "All nodes";
    }));

    this.selectedUnitText$ = store.select(fromEquipment.getEquipmentUnitFilter).pipe(map(u => {
      return u ? u.name : "All units";
    }));

    this.selectedLocationText$ = store.select(fromEquipment.getEquipmentLocationFilter).pipe(map(l => {
      return l ? l.name : "All locations";
    }));

    this.selectedLog$ = store.select(buildingCommonData.getSelectedHistoryLog).subscribe(s => {      
      this.store.dispatch(new equipmentActions.RequestEquipmentList());
    });
  }

  ngOnInit() {    
    this.store.dispatch(new wizardAction.CloseWizard());
    this.store.dispatch(new bulkWizardAction.CloseWizard());
    this.store.dispatch(new replaceWizardAction.CloseWizard());
    this.equipmentList$ = this.equipmentList$.pipe(switchMap(equipments => {
      equipments = equipments.map(equipment => {
        let locationId = equipment.location.location.id;
        equipment.location.location.SequenceNumber = this.locationList.findIndex((obj) =>obj.id == locationId);
        return equipment;
      });
      equipments = equipments.sort((a, b) => {
        if (a.location.location.SequenceNumber > b.location.location.SequenceNumber) return 1;
        else if (a.location.location.SequenceNumber < b.location.location.SequenceNumber) return -1;
        else {
          return a.sequenceNumber > b.sequenceNumber ? 1 : -1;
        }
      });
      return of(equipments);
    }))

    this.store.pipe(select(buildingCommonData.getIsFinalized))
      .subscribe(res => {
        this.buildingPeriodIsFinalized = res;
      })
  }

  ngOnDestroy() {
    this.selectedLog$.unsubscribe();
    this.subscriber$ && this.subscriber$.unsubscribe();
  }

  search(event): void {
    this.store.dispatch(new equipmentActions.UpdateSearchKey(event));
  }

  onClone(event) {
    this.store.dispatch(new equipmentActions.CloneEquipment(event));
  }

  onAddReplace(event) {
    this.store.dispatch(new replaceWizardAction.ResetWizard());
    this.store.dispatch(new replaceWizardAction.ToggleWizard());
    this.store.dispatch(new replaceWizardAction.SetWizardLocationAppointment(false));
    this.store.dispatch(new addClosingReadingsAction.InitRegisters(event));
    const modalRef = this.modalService.open(ReplaceEquipmentComponent, {
      backdrop: 'static',
      windowClass: 'replace-meter-modal'
    });
  }

  goToEquipmentDetail(equipment: any) {
    this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.version, 'equipment', equipment.id]);
  }

  onUnitChanged(event) {
    this.store.dispatch(new equipmentActions.UpdateUnitFilter(event));
  }

  onNodeChanged(event) {
    this.store.dispatch(new equipmentActions.UpdateNodeFilter(event));
  }

  onSupplyTypeChanged(event) {
    this.store.dispatch(new equipmentActions.UpdateSupplyTypeFilter(event));
  }

  onLocationChanged(event) {
    this.store.dispatch(new equipmentActions.UpdateLocationFilter(event));
  }

  changeOrderIndex(event) {
    if (this.orderIndex == event || (this.orderIndex == (event * -1))) {
      this.orderIndex *= -1;
    } else {
      this.orderIndex = event;
    }

    this.store.dispatch(new equipmentActions.UpdateOrder(this.orderIndex));
  }

  onAddMeter() {
    if(this.buildingPeriodIsFinalized) return false;
    this.store.dispatch(new wizardAction.ResetWizard());
    this.store.dispatch(new wizardAction.WizardLocationAppointment(false));
    this.store.dispatch(new locationStepActions.SetLocationDataForEquipment());
  }

  onAddBulkMeter() {
    this.store.dispatch(new bulkWizardAction.ResetWizard());
    this.store.dispatch(new bulkWizardAction.GetLocation());
  }

}
