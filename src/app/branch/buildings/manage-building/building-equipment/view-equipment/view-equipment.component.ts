import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Location} from '@angular/common'
import {filter, map, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {select, Store} from '@ngrx/store';

import * as fromCommonData from '../../shared/store/selectors/common-data.selectors';
import {State as BuildingCommonDataState} from '../../shared/store/state/common-data.state';
import * as commonDataAction from '../../shared/store/actions/common-data.action';
import {HistoryViewModel} from '@models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BranchManagerService} from '@services';

@Component({
  selector: 'view-equipment',
  templateUrl: './view-equipment.component.html',
  styleUrls: ['./view-equipment.component.less']
})
export class ViewEquipmentComponent implements OnInit, OnDestroy {

  tabId: any = 'tabEquip-0';

  destroyed$ = new Subject();
  buildingId: string;
  branchId: string;
  versionDay: string;

  histories$: Observable<HistoryViewModel[]>;
  currentHistory$: Observable<HistoryViewModel>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<BuildingCommonDataState>,
    private location: Location,
    private modalService: NgbModal,
    private branchManager: BranchManagerService
  ) {
    router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => {
        return route.snapshot.data['tabEquip'];
      }),
      takeUntil(this.destroyed$)
    ).subscribe(r => {
      if (r) {
        this.tabId = r;
      }
    });

    this.histories$ = store.select(fromCommonData.getHistoryLogs);
    this.currentHistory$ = store.select(fromCommonData.getSelectedHistoryLog);

    store.pipe(select(fromCommonData.getBuildingId),
      takeUntil(this.destroyed$)
    ).subscribe(buildingId => this.buildingId = buildingId);

    store.pipe(select(fromCommonData.getSelectedHistoryLog),
      takeUntil(this.destroyed$)
    ).subscribe(version => {
      this.versionDay = version ? version.versionDay : null;
    });

    this.branchId = this.branchManager.getBranchId();
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onBeforeTabChange($event) {
    let path = [];
    this.tabId = $event.nextId;

    switch ($event.nextId) {
      case 'tabEquip-1':
        path = ['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.versionDay, 'equipment', 'locations'];
        break;
      case 'tabEquip-2':
        path = ['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.versionDay, 'equipment', 'nodes'];
        break;
      case 'tabEquip-3':
        path = ['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.versionDay, 'equipment', 'equipment-templates'];
        break;
      case 'tabEquip-4':
        path = ['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.versionDay, 'equipment', 'equipment-tree'];
        break;
      case 'tabEquip-5':
        path = ['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.versionDay, 'equipment', 'virtual-registers'];
        break;

      default:
        path = ['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.versionDay, 'equipment'];
        break;
    }

    this.router.navigateByUrl((path.join('/')));
  }

  onHistoryChange($event) {
    this.store.dispatch(new commonDataAction.HistoryChange($event));
  }
}
