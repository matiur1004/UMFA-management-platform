import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';

import {TenantBuildingViewModel} from '../models/profile.model';

import * as profilesActions from '../store/actions/profile.actions';
import * as profilesSelector from '../store/selectors/profiles.selector';

@Component({
  selector: 'tenant-page-profiles',
  templateUrl: './page-profiles.component.html',
  styleUrls: ['./page-profiles.component.less']
})
export class PageProfilesComponent implements OnInit, OnDestroy {

  tenantBuildings$: Observable<TenantBuildingViewModel[]>;
  buildings$: Observable<any[]>;
  selectedBuilding$: Observable<any>;

  private searchTermsSubject = new Subject<string>();

  constructor(private store: Store<any>, private router: Router) {
    this.tenantBuildings$ = store.pipe(select(profilesSelector.getTenantBuildings));
    this.buildings$ = store.pipe(select(profilesSelector.getBuildings));
    this.selectedBuilding$ = store.pipe(select(profilesSelector.getSelectedBuilding));

    this.searchTermsSubject.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      tap((term: string) => {
        store.dispatch(new profilesActions.UpdateSearchKey(term));
      })
    ).subscribe();
  }

  ngOnInit() {
    this.store.dispatch(new profilesActions.TenantBuildingListRequest());
  }

  ngOnDestroy() {
    this.searchTermsSubject.unsubscribe();
  }

  onSearch(term: string) {
    this.searchTermsSubject.next(term);
  }

  onBuildingUpdate($event) {
    this.store.dispatch(new profilesActions.UpdateBuildingFilter($event));
  }

  onDeleteProfile($event) {
    this.store.dispatch(new profilesActions.DeleteProfile($event));
  }

  onShopDetailView(buildingId, shopId) {
    this.router.navigate(['tenant', 'profiles', buildingId, 'shops', shopId]);
  }

}
