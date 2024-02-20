import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';

import {OccupationService} from '@services';

import * as fromOccupation from '../../shared/store/reducers';
import * as occupationAction from '../../shared/store/actions/occupation.actions';
import * as commonStore from '../../../shared/store/state/common-data.state';
import * as commonDataActions from '../../../shared/store/actions/common-data.action';
import * as commonData from '../../../shared/store/selectors/common-data.selectors';
import {take} from 'rxjs/operators';

@Component({
  selector: 'occupation',
  templateUrl: './occupation.component.html',
  styleUrls: ['./occupation.component.less']
})
export class OccupationComponent implements OnInit, OnDestroy {
  branchId: string;
  buildingId: string;
  isInitialized = false;
  private paramsSubscription$: Subscription;
  private isComplete$: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private occupationService: OccupationService,
    private store: Store<fromOccupation.State>,
    private storeCommon: Store<commonStore.State>,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.paramsSubscription$ = combineLatest(
      [this.activatedRoute.pathFromRoot[2].params,
      this.activatedRoute.pathFromRoot[4].params,
      this.activatedRoute.pathFromRoot[6].params]
    ).subscribe(([branchParams, parentParams, childParams]) => {
      this.buildingId = parentParams['id'];
      this.branchId = branchParams['branchid'];
      let versionId = childParams['versionId'];

      this.occupationService.get(this.buildingId, versionId).subscribe(r => {
        this.store.dispatch(new occupationAction.Get(r));
      });
    });

    this.isComplete$ = this.store.select(fromOccupation.getCompleteStatus).subscribe((res: boolean) => {
      if (res) {
        this.storeCommon.dispatch(new commonDataActions.GetHistoryWithVersionId(null));
        this.storeCommon.pipe(select(commonData.getSelectedHistoryLog), take(1)).subscribe(version => {
          if (version) {
            this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', version.versionDay, 'occupation'], {});
          }
        });
      } else {
        this.isInitialized = true;
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription$.unsubscribe();
    this.isComplete$.unsubscribe();
  }
}
