import {Component, OnDestroy, OnInit} from '@angular/core';

import {Observable, of, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';

import * as fromStore from '../building-equipment/shared/store/reducers';
import {ActivatedRoute, Router} from '@angular/router';
import {HistoryViewModel} from '@models';
import * as buildingCommonData from '../shared/store/selectors/common-data.selectors';
import * as actions from '../shared/store/actions/common-data.action';
import { BuildingPeriodsService } from '../shared/services/building-periods.service';
import * as fromBuildingPeriods from '../meter-readings/billing-readings/shared/store/reducers/';

import { sortRule } from '../tariffs/components/building-tariff-values/building-tariff-values.component';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from '@app/shared/services';

@Component({
  selector: 'layout-selecting-version',
  templateUrl: './layout-selecting-version.component.html',
  styleUrls: ['./layout-selecting-version.component.less']
})
export class LayoutSelectingVersionComponent implements OnInit, OnDestroy {
  public versionsList$: Observable<any>;
  public versions: any[];
  public selectedVersion: HistoryViewModel;
  public selectedVersionId;
  public prevVersion: HistoryViewModel;
  public disableChangeVersion$: Observable<boolean>;
  public buildingPeriods$: Observable<any>;

  public buildingId;
  public periods: any[];
  public selectedVersionDay;

  private route$: Subscription;
  private versions$: Observable<any>;
  constructor(
    private readonly store$: Store<fromStore.State>,
    private route: ActivatedRoute,
    private router: Router,
    private bldPeriodsService: BuildingPeriodsService,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit() {
    this.versionsList$ = this.store$.pipe(select(buildingCommonData.getHistoryLogs));
    this.versionsList$.subscribe((versions: HistoryViewModel[]) => {
      this.versions = versions;
    });
    this.disableChangeVersion$ = this.store$.pipe(select(buildingCommonData.getIsDisableChangeVersionStatus));
    this.buildingPeriods$ = this.store$.pipe(select(fromBuildingPeriods.getBuildingPeriods));

    this.store$.pipe(select(buildingCommonData.getBuildingId)).subscribe(buildingId => {
      this.buildingId = buildingId;
      this.loadBuildingPeriods();
    });
    this.route$ = this.route.params.subscribe(params => {
      this.selectedVersionDay = this.prevVersion = params.vid;

    });

    this.buildingPeriods$.subscribe(buildingPeriods => {
      if(this.buildingId) {
        if(buildingPeriods.length == 0) this.loadBuildingPeriods();
        else this.versionGroupByPeriod(buildingPeriods);
      }
    })
  }

  loadBuildingPeriods() {
    this.bldPeriodsService.getAllShort(this.buildingId).subscribe(r => {
      this.versionGroupByPeriod(r);
    });
  }

  versionGroupByPeriod(r: any) {
    this.periods = r.sort((a, b) => sortRule(new Date(b.endDate), new Date(a.endDate)));
      this.versions = this.versions.map(version => {
        let versionDt = new Date(version.startDate);
        let buildingPeriod = this.periods.find(period => {
          let periodStartDt = new Date(period.startDate);
          let periodEndDt = new Date(period.endDate);
          if(versionDt.getTime() >= periodStartDt.getTime() && versionDt.getTime() <= periodEndDt.getTime()) {
            return true;
          }
          return false;
        });
        version['buildingPeriodId'] = buildingPeriod ? buildingPeriod.id : '';
        version['buildingPeriodName'] = buildingPeriod ? buildingPeriod.name : '';
        version['isFinalized'] = buildingPeriod ? buildingPeriod.isFinalized : false;
        return version;
      })
      const version = this.versions.find(el => el.versionDay === this.selectedVersionDay);
        if (version) {
          this.store$.dispatch(new actions.HistoryChange(version.id));
          this.selectedVersion = this.prevVersion = version;
          this.selectedVersionId = version.id;
          this.store$.dispatch(new actions.SetIsFinalized( version['isFinalized'] ? true : false))
        }
      this.versions$ = of(this.versions);
  }

  ngOnDestroy() {
    this.route$ && this.route$.unsubscribe();
    //this.versions$ && this.versions$.unsubscribe();
  }

  onVersionSelected(newVersion: HistoryViewModel) {
    if(newVersion['isFinalized']) {
      this.notificationService.info('You have selected a version related to a finalized building period, please note that changes will not be allowed');
    }
    this.store$.dispatch(new actions.SetIsFinalized( newVersion['isFinalized'] ? true : false))
    const url = this.router.url;
    let newUrl: string;
    if (url.indexOf('version/null/') !== -1) {
      newUrl = this.router.url.replace('version/null/', 'version/' + newVersion.versionDay + '/');
    } else {
      newUrl = this.router.url.replace(this.prevVersion.versionDay, newVersion.versionDay);
    }
    this.router.navigate([newUrl]);
  }

}
