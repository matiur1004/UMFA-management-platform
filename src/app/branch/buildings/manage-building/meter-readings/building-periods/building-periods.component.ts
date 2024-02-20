import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Store} from '@ngrx/store';

import {EditBldPeriodComponent} from './edit-bld-period/edit-bld-period.component';
import {ConfirmRollbackComponent} from './confirm-rollback/confirm-rollback.component';
import * as fromBuildingPeriods from '../billing-readings/shared/store/reducers';
import * as buildingPeriodsAction from './shared/store/actions/building-periods.actions';
import * as buildingPeriodFormActions from './shared/store/actions/building-period-form.actions';
import {BuildingPeriodViewModel} from '../../shared/models/building-period.model';

@Component({
  selector: 'building-periods',
  templateUrl: './building-periods.component.html',
  styleUrls: ['./building-periods.component.less']
})
export class BuildingPeriodsComponent implements OnInit, OnDestroy {
  pageSizes = [30, 50, 100];
  buildingPeriods$: Observable<BuildingPeriodViewModel[]>;
  total$: Observable<number>;
  page$: Observable<number>;
  pageSize$: Observable<number>;
  latestBuildingPeriod$: Observable<BuildingPeriodViewModel>;
  previousBuildingPeriod$: Observable<BuildingPeriodViewModel>;
  buildingPeriodsDict$: Observable<{ [key: string]: BuildingPeriodViewModel }>;
  private searchFilterText$ = new Subject<string>();
  private destroyed$ = new Subject();

  constructor(
    private store: Store<fromBuildingPeriods.State>,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal) {

    this.buildingPeriods$ = store.select(fromBuildingPeriods.getBuildingPeriodsWithLinked);
    this.total$ = store.select(fromBuildingPeriods.getBuildingPeriodsTotal);
    this.page$ = store.select(fromBuildingPeriods.getBuildingPeriodsPage);
    this.pageSize$ = store.select(fromBuildingPeriods.getBuildingPeriodsPageSize);
    this.latestBuildingPeriod$ = store.select(fromBuildingPeriods.getLatestBuildingPeriod);
    this.previousBuildingPeriod$ = store.select(fromBuildingPeriods.getPreviousBuildingPeriod);
  }

  ngOnInit() {
    this.store.dispatch(new buildingPeriodsAction.GetBuildingPeriods());

    this.searchFilterText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroyed$)
    ).subscribe((text) => {
      this.store.dispatch(new buildingPeriodsAction.SetSearchFilter(text));
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  onPageSizeChanged(size: number) {
    this.store.dispatch(new buildingPeriodsAction.SetPageSize(size));
  }

  onPageChanged(page: number) {
    this.store.dispatch(new buildingPeriodsAction.SetPage(page - 1));
  }

  onSearchFilterChanged(filter: string) {
    this.searchFilterText$.next(filter);
  }

  onFinalizeBuildingPeriod() {
    const modalRef = this.modalService.open(EditBldPeriodComponent, {backdrop: 'static'});
    this.store.dispatch(new buildingPeriodFormActions.FinalizeBuildingPeriod(modalRef));
  }

  onEditBuildingPeriod() {
    const modalRef = this.modalService.open(EditBldPeriodComponent, {backdrop: 'static'});
    this.store.dispatch(new buildingPeriodFormActions.EditBuildingPeriod(modalRef));
  }

  onRollback() {
    const modalRef = this.modalService.open(ConfirmRollbackComponent, {
      backdrop: 'static',
      windowClass: 'building-rollback-modal'
    });
  }

}
