import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';

import {OccupationService} from '@services';
import {StringExtension} from 'app/shared/helper/string-extension';
import * as commonDataActions from '../../shared/store/actions/common-data.action';
import { select, Store } from '@ngrx/store';
import {State as CommonDataState} from '../../shared/store/state/common-data.state';
import * as selectors from '../../shared/store/selectors/common-data.selectors';
import { BuildingPeriodsService } from '../../shared/services/building-periods.service';
import { sortRule } from '@app/shared/helper';
@Component({
  selector: 'history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.less']
})
export class HistoryComponent implements OnInit {

  logs: any[] = new Array<any>();
  filteredLogs: any[] = new Array<any>();
  buildingId: string;
  orderIndex: number = 0;
  searchKey: string = null;
  selectedPeriod: any;
  periods: any[];

  private searchTermsSubject = new Subject<string>();

  constructor(
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private occupationService: OccupationService,
    private readonly store$: Store<CommonDataState>,
    private bldPeriodsService: BuildingPeriodsService,
  ) {
  }

  ngOnInit() {
    this.store$.pipe(select(selectors.getActiveBuildingPeriod)).subscribe(period => {
      this.selectedPeriod = period});
    
    
    this.activatedRoute.pathFromRoot[4].params.subscribe(params => {
      let id = params['id'];

      if (StringExtension.isGuid(id)) {
        this.buildingId = id;
        this.loadBuildingPeriods();
        this.loadData();
      }
    });

    this.searchTermsSubject.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      tap((term: string) => {
        this.searchKey = term;
        this.loadData();
      }),
    ).subscribe();
  }

  loadBuildingPeriods() {
    this.bldPeriodsService.getAllShort(this.buildingId).subscribe(r => {
      this.periods = r.sort((a, b) => sortRule(new Date(b.endDate), new Date(a.endDate)));
      this.periods.splice(0, 0, {name: 'All', id: ''});
    });
  }

  loadData() {
    this.occupationService.getFullHistory(this.buildingId, this.searchKey, this.orderIndex).subscribe(r => {
      this.logs = r.map(i => {
        let isExpanded = false;

        let srcLog = this.logs.find(l => l.id === i.id);
        if (srcLog) {
          isExpanded = srcLog.isExpanded;
        }
        return {...i, isExpanded: isExpanded};
      });
      this.onPeriodChanged(this.selectedPeriod);
    });
  }

  onPeriodChanged(period: any) {
    if(period.id == '') this.filteredLogs = this.logs;
    else {
      this.filteredLogs = this.logs.filter(log => {
        let versionDt = new Date(log.versionDate);
        let periodStartDt = new Date(period.startDate);
        let periodEndDt = new Date(period.endDate);
        if(versionDt.getTime() >= periodStartDt.getTime() && versionDt.getTime() < periodEndDt.getTime()) {
          return true;
        }
        return false;
      })
    }
    this.selectedPeriod = period;
  }

  makeActual(baseVersionId) {
    this.occupationService.revertTo(this.buildingId, baseVersionId).subscribe(r => {
      this.store$.dispatch(new commonDataActions.BuildingIdGuardChangeBuildingId({buildingId: this.buildingId}));
      this.loadData();
    });
  }

  toggle(log) {
    log.isExpanded = !log.isExpanded;
  }

  search(term: string): void {
    this.searchTermsSubject.next(term);
  }

  onChangeOrder(orderIndex) {
    if (this.orderIndex == orderIndex) {
      return;
    }

    this.orderIndex = orderIndex;
    this.loadData();
  }
}
