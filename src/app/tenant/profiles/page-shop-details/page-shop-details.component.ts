import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {NgbNavChangeEvent} from '@ng-bootstrap/ng-bootstrap';

import {ShopCostsViewModel, ShopGeneralInfoViewModel, ShopMeterViewModel, TabId} from '../models/shop-detail.model';

import * as generalInfoActions from '../../store/actions/shop-detail-actions/general-info.actions';
import * as allocatedEquipmentActions from '../../store/actions/shop-detail-actions/allocated-equipment.actions';
import * as costsActions from '../../store/actions/shop-detail-actions/costs.actions';

import * as generalInfoSelector from '../../store/selectors/shop-detail-selectors/general-info.selector';
import * as allocatedEquipmentSelector from '../../store/selectors/shop-detail-selectors/allocated-equipment.selector';
import * as costsSelector from '../../store/selectors/shop-detail-selectors/costs.selector';

@Component({
  selector: 'tenant-page-shop-details',
  templateUrl: './page-shop-details.component.html',
  styleUrls: ['./page-shop-details.component.less']
})
export class PageShopDetailsComponent implements OnInit, OnDestroy {

  // general info
  generalInfo$: Observable<ShopGeneralInfoViewModel>;

  // allocated equipment
  allocatedEquipment$: Observable<ShopMeterViewModel[]>;

  // costs
  costs$: Observable<ShopCostsViewModel>;

  tabId = TabId;
  activeId = TabId.GeneralInfo
  constructor(private store: Store<any>, private activatedRoute: ActivatedRoute) {
    this.generalInfo$ = store.pipe(select(generalInfoSelector.getGeneralInfo));
    this.allocatedEquipment$ = store.pipe(select(allocatedEquipmentSelector.getAllocatedEquipment));
    this.costs$ = store.pipe(select(costsSelector.getCosts));
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const shopId = params['shopId'];
      const buildingId = params['buildingId'];
      this.store.dispatch(new generalInfoActions.SetShopId(shopId));
      this.store.dispatch(new generalInfoActions.SetBuildingId(buildingId));
      this.onGetGeneralInfo();
    });
  }

  beforeChange($event: NgbNavChangeEvent) {
    switch (+$event.nextId) {
      case TabId.GeneralInfo:
        this.onGetGeneralInfo();
        break;
      case TabId.AllocatedEquipment:
        this.onGetAllocatedEquipment();
        break;
      case TabId.Costs:
        this.onGetCosts();
        break;
    }
  }

  onGetGeneralInfo() {
    this.store.dispatch(new generalInfoActions.GetGeneralInfoRequest());
  }

  onGetAllocatedEquipment() {
    this.store.dispatch(new allocatedEquipmentActions.GetAllocatedEquipRequest());
  }

  onGetCosts() {
    this.store.dispatch(new costsActions.GetCostsRequest());
  }

  ngOnDestroy() {
  }

}
