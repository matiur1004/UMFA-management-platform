import {Component, EventEmitter, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbNavChangeEvent, NgbNav} from '@ng-bootstrap/ng-bootstrap';
import {Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';

import {CommonAreaLiabilityViewModel, Dictionary, LiabilityViewModel} from '@models';
import * as fromOccupation from '../../../shared/store/reducers';
import * as occupationAction from '../../../shared/store/actions/occupation.actions';

@Component({
  selector: 'app-common-area-liablity-view',
  templateUrl: './common-area-liablity-view.component.html',
  styleUrls: ['./common-area-liablity-view.component.less']
})
export class CommonAreaLiablityViewComponent implements OnInit, OnDestroy {

  selectedCommonAreaLiablity: CommonAreaLiabilityViewModel = new CommonAreaLiabilityViewModel();
  selectedCommonAreaLiablityServiceType: string = '0';
  selectedCommonAreaLiablityService: LiabilityViewModel = new LiabilityViewModel();
  liabilityShopSearchTerm: string;

  @ViewChild('nav', {static: true}) tabs: NgbNav;

  selectedCommonAreaLiablity$: Subscription;
  selectedCommonAreaLiablityServiceType$: Subscription;
  selectedCommonAreaLiablityService$: Subscription;
  liabilityShopSearchTerm$: Subscription;

  liabilityShopFilter$: Observable<number>;
  goToNodeDetail: EventEmitter<string>;

  constructor(private store: Store<fromOccupation.State>, private activeModal: NgbActiveModal) {
    this.selectedCommonAreaLiablity$ = store.select(fromOccupation.getSelectedCommonAreaLiability).subscribe(cal => {
      this.selectedCommonAreaLiablity = cal;
    });

    this.selectedCommonAreaLiablityServiceType$ = store.select(fromOccupation.getSelectedCommonAreaLiabilityServiceType).subscribe(cal => {
      this.selectedCommonAreaLiablityServiceType = cal.toString();
    });

    this.selectedCommonAreaLiablityService$ = store.select(fromOccupation.getSelectedCommonAreaLiabilityService).subscribe(cal => {
      this.selectedCommonAreaLiablityService = cal;
    });

    this.liabilityShopSearchTerm$ = store.select(fromOccupation.getLiabilityShopSearchTerm).subscribe(searchTerm => {
      this.liabilityShopSearchTerm = searchTerm;
    });

    this.liabilityShopFilter$ = store.select(fromOccupation.getLiabilityShopFilter);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.selectedCommonAreaLiablity$.unsubscribe();
    this.selectedCommonAreaLiablityServiceType$.unsubscribe();
    this.selectedCommonAreaLiablityService$.unsubscribe();
    this.liabilityShopSearchTerm$.unsubscribe();
  }

  onClose() {
    this.activeModal.close();
  }


  canNavigate(): boolean {
    return true;
  }

  public beforeChange($event: NgbNavChangeEvent) {
    this.store.dispatch(new occupationAction.CommonAreaLiabilityServiceSelected(+$event.nextId));
    $event.preventDefault();
  }

  onOwnerLiabilityChanged($event) {
    this.store.dispatch(new occupationAction.UpdateCommonServiceLiability({
      commonAreaId: this.selectedCommonAreaLiablity.commonAreaId,
      serviceType: this.selectedCommonAreaLiablityService.serviceType,
      path: 'ownerLiable',
      value: $event
    }));
  }

  onIncludeNotLiableShopsChanged($event) {
    this.store.dispatch(new occupationAction.UpdateCommonServiceLiability({
      commonAreaId: this.selectedCommonAreaLiablity.commonAreaId,
      serviceType: this.selectedCommonAreaLiablityService.serviceType,
      path: 'includeNotLiableShops',
      value: $event
    }));
  }

  onIncludeVacantShopSqMChanged($event) {
    this.store.dispatch(new occupationAction.UpdateCommonServiceLiability({
      commonAreaId: this.selectedCommonAreaLiablity.commonAreaId,
      serviceType: this.selectedCommonAreaLiablityService.serviceType,
      path: 'includeVacantShopSqM',
      value: $event
    }));
  }

  onUpdateSplit($event) {
    this.store.dispatch(new occupationAction.UpdateCommonServiceLiability({
      commonAreaId: this.selectedCommonAreaLiablity.commonAreaId,
      serviceType: this.selectedCommonAreaLiablityService.serviceType,
      path: 'splitType',
      value: $event
    }));
  }

  onDefaultSettingsChanged($event) {
    this.store.dispatch(new occupationAction.UpdateCommonServiceLiability({
      commonAreaId: this.selectedCommonAreaLiablity.commonAreaId,
      serviceType: this.selectedCommonAreaLiablityService.serviceType,
      path: 'defaultSettings',
      value: +$event
    }));
  }

  onUpdateShopAllocation($event) {
    this.store.dispatch(new occupationAction.UpdateShopAllocationByService({
      commonAreaId: this.selectedCommonAreaLiablity.commonAreaId,
      shopId: $event.shopId,
      serviceType: this.selectedCommonAreaLiablityService.serviceType,
      allocation: +$event.value
    }));
  }

  onUpdateShopTermSearch($event) {
    this.store.dispatch(new occupationAction.UpdateLiabilityShopSearchTerm($event));
  }

  onUdateShopFilter($event) {
    this.store.dispatch(new occupationAction.UpdateLiabilityShopFilter($event));
  }

  onUpdateShopLiability($event) {
    this.store.dispatch(new occupationAction.UpdateShopLiableByService({
      commonAreaId: this.selectedCommonAreaLiablity.commonAreaId,
      shopId: $event.shopId,
      serviceType: this.selectedCommonAreaLiablityService.serviceType,
      value: $event.value
    }));
  }

  onGoToNodeDetail(nodeId: string) {
    this.goToNodeDetail.emit(nodeId);
  }

  getSupplyTypeNodes(supplyTypeNodes: Dictionary<Dictionary<string>>, type: string) {
    return supplyTypeNodes ? supplyTypeNodes[type] : null;
  }
}
