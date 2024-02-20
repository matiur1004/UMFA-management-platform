import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {Observable, of, Subject} from 'rxjs';
import {select, Store} from '@ngrx/store';

import * as commonData from './shared/store/selectors/common-data.selectors';
import * as fromStore from './shared/store/state/common-data.state';
import * as commonDataActions from './shared/store/actions/common-data.action';
import {map, takeUntil} from 'rxjs/operators';
import {BranchManagerService} from '@services';
import {HistoryViewModel} from '@models';

@Injectable({
  providedIn: 'root'
})
export class VersionGuardService {
  private guardComplete = new Subject();

  constructor(
    private router: Router,
    private branchManager: BranchManagerService,
    private readonly store$: Store<fromStore.State>
  ) {
  }

  getListOfVersions(currentVersionDay): Observable<any> {
    return this.store$.pipe(
      select(commonData.getHistoryLogs),
      map((storeVersionList) => {
        const correctVersion = storeVersionList.find((el: HistoryViewModel) => el.versionDay === currentVersionDay);
        if (correctVersion) {
          this.store$.dispatch(new commonDataActions.HistoryChange(correctVersion.id));
          return true;
        } else {
          console.warn('Did not find version in list');
          return false;
        }
      }));
  }

  getActiveVersion() {
    return this.store$.pipe(select(commonData.getSelectedHistoryLog), takeUntil(this.guardComplete));
  }

  canActivate(
    next: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const branchId = this.branchManager.getBranchId();
    const buildingId = next.parent.params.id;
    const versionDay = next.params.vid;

    if (versionDay === '0') {
      this.guardComplete = new Subject();
      this.getActiveVersion().subscribe(activeVersion => {
        const subPath = this.getSubUrl(next.children[0]);
        console.info('Redirect...', subPath);
        this.guardComplete.next();
        this.guardComplete.complete();

        if (activeVersion) {
          this.router.navigate(['/branch', branchId, 'buildings', buildingId, 'version', activeVersion.versionDay].concat(subPath), {replaceUrl: false});
        } else {
          console.warn('TODO add fix for first opening occupation (building) page');
          this.router.navigate(['/branch', branchId, 'buildings', buildingId, 'version', 'null', 'occupation'], {replaceUrl: true});
        }
      });
      return of(false);
    } else if (!versionDay) {
      return of(true);
    } else {
      return this.getListOfVersions(versionDay);
    }
  }

  /**
   * Get less url after version
   * @param data ActivatedRouteSnapshot
   */
  getSubUrl(data: ActivatedRouteSnapshot) {
    let url = [];
    if (data.url.length && data.url[0].path) {
      url = url.concat(data.url.map(el => el.path));
    }
    if (data.children.length) {
      url = url.concat(this.getSubUrl(data.children[0]));
    }
    return url;
  }
}
