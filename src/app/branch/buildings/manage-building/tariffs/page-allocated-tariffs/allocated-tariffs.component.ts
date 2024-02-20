import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {select, Store} from '@ngrx/store';

import {AggregatedBuildingTariffViewModel} from '@models';
import {ChargeViewModel} from '../../shared/models';

import * as fromStore from '../store';
import * as fromCommonStore from '../../shared/store/selectors/common-data.selectors';


@Component({
  selector: 'allocated-tariffs',
  templateUrl: './allocated-tariffs.component.html',
  styleUrls: ['./allocated-tariffs.component.less']
})
export class AllocatedTariffsComponent implements OnInit, OnDestroy {
  public branchId: string;
  public buildingId: string;
  public charges$: Observable<ChargeViewModel[]>;
  public tariffs$: Observable<AggregatedBuildingTariffViewModel[]>;
  buildingPeriodIsFinalized$: Observable<any>;
  private pathSubscriptoin$: Subscription;

  constructor(
    private store: Store<fromStore.State>,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.pathSubscriptoin$ = combineLatest(
      this.route.pathFromRoot[2].params,
      this.route.pathFromRoot[4].params,
      this.store.pipe(select(fromCommonStore.getSelectedHistoryLog))
    ).subscribe(([branchParams, buildingParams, selectedVersion]) => {
      this.branchId = branchParams['branchid'];
      this.buildingId = buildingParams['id'];
      if (selectedVersion) {
        this.store.dispatch(new fromStore.GetBuildingAdditionalCharges({
          buildingId: this.buildingId,
          versionId: selectedVersion.id
        }));
        this.store.dispatch(new fromStore.SetAllocatedBuildingTariffsBySupplyFilter({
          supplyType: null,
          supplierId: ''
        }));
        this.store.dispatch(new fromStore.GetAllocatedBuildingTariffs({
          buildingId: this.buildingId,
          versionId: selectedVersion.id
        }));
      }
    });

    this.charges$ = this.store.pipe(select(fromStore.selectAdditionalCharges));
    this.tariffs$ = this.store.pipe(select(fromStore.selectBuildingTariffsFiltered));

    this.buildingPeriodIsFinalized$ = this.store.pipe(select(fromCommonStore.getIsFinalized));
  }

  ngOnDestroy() {
    this.pathSubscriptoin$.unsubscribe();
  }
}
