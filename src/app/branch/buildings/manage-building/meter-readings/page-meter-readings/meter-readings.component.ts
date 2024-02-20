import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {select, Store} from '@ngrx/store';

import * as billingReadingAction from '../billing-readings/shared/store/actions/billing-readings.actions';
import * as store from '../../building-equipment/shared/store/reducers';
import {distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import * as buildingCommonData from '../../shared/store/selectors/common-data.selectors';

@Component({
  selector: 'meter-readings',
  templateUrl: './meter-readings.component.html',
})
export class MeterReadingsComponent implements OnInit, OnDestroy {
  destroyed = new Subject();
  tabId: any = "tab-0"

  constructor(private store: Store<store.State>, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.store.pipe(select(buildingCommonData.getBuildingId),
      takeUntil(this.destroyed),
      distinctUntilChanged()).subscribe(() => {
      this.store.dispatch(new billingReadingAction.RequestBuildingPeriodsList());
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
