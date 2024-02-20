import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {BuildingDetailViewModel, BuildingShopViewModel} from '../shared/models/buildings.model';

import * as buildingDetailsActions from '../shared/store/actions/building-details.actions';
import * as shopActions from '../shared/store/actions/shop.actions';
import * as buildingDetailsSelector from '../shared/store/selectors/building-details.selector';
import {ShopStatus, shopStatuses} from '@models';
import {SplitShopComponent} from './split-shop/split-shop.component';

@Component({
  selector: 'building-details',
  templateUrl: './building-details.component.html',
  styleUrls: ['./building-details.component.less']
})

export class BuildingDetailsComponent implements OnInit, OnDestroy {

  building$: Observable<BuildingDetailViewModel>;
  shops$: Observable<BuildingShopViewModel[]>;

  selectedTenant$: Observable<any>;
  tenants$: Observable<any[]>;

  selectedFloor$: Observable<number | null>;
  floors$: Observable<number[]>;

  selectedStatus$: Observable<number | null>;
  status = ShopStatus;
  statuses = shopStatuses;

  buildingId: string;

  private searchTermsSubject = new Subject<string>();

  constructor(private store: Store<any>, private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {
    this.building$ = store.pipe(select(buildingDetailsSelector.getBuilding));
    this.shops$ = store.pipe(select(buildingDetailsSelector.getShops));

    this.selectedTenant$ = store.pipe(select(buildingDetailsSelector.getSelectedTenant));
    this.tenants$ = store.pipe(select(buildingDetailsSelector.getTenants));

    this.selectedFloor$ = store.pipe(select(buildingDetailsSelector.getFloor));
    this.floors$ = store.pipe(select(buildingDetailsSelector.getFloors));

    this.selectedStatus$ = store.pipe(select(buildingDetailsSelector.getStatus));

    this.searchTermsSubject.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      tap((term: string) => {
        store.dispatch(new buildingDetailsActions.UpdateSearchKey(term));
      })
    ).subscribe();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.buildingId = params['buildingId'];
      this.store.dispatch(new buildingDetailsActions.BuildingDetailsRequest(this.buildingId));
    });
  }

  ngOnDestroy() {
    this.searchTermsSubject.unsubscribe();
  }

  onSearch(value: string) {
    this.searchTermsSubject.next(value);
  }

  onToggleShop(event$) {
    this.store.dispatch(new buildingDetailsActions.UpdateIsToggle({index: event$, buildingId: this.buildingId}));
  }

  onChangeTenant(event$) {
    this.store.dispatch(new buildingDetailsActions.UpdateTenantFilter(event$));
  }

  onChangeFloor(event$) {
    this.store.dispatch(new buildingDetailsActions.UpdateFloorFilter(event$));
  }

  onChangeStatus(event$) {
    this.store.dispatch(new buildingDetailsActions.UpdateStatusFilter(event$));
  }

  onSplitShop(event$) {
    this.store.dispatch(new shopActions.SetShop(event$));
    const modalRef = this.modalService.open(SplitShopComponent, {backdrop: 'static', windowClass: 'splt-modal'});
  }

  onSpareShop(event$) {
    this.store.dispatch(new shopActions.ToggleSpare(event$));
  }

  onChangeRentDetails(event$) {

  }

  onRequestChanges() {
    this.store.dispatch(new buildingDetailsActions.SaveChangesRequest());
  }

  onCancel() {
    this.router.navigate(['client', 'buildings']);
  }
}
