import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {BranchManagerService} from '@services';

@Injectable({
  providedIn: 'root'
})
export class BranchesGuard implements CanActivate {
  constructor(
    private branchManager: BranchManagerService,
    private router: Router
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const branchId = next.params['branchid'];
    return this.branchManager.getAllBranches(branchId).pipe(
      map(list => {
        if (list.length > 0 && list.find(el => el.id === branchId)) {
        } else {
          console.info('Branch ID is incorrect');
          this.router.navigate(['/page404'], { /*skipLocationChange: true*/ replaceUrl: true});
        }
        return true;
      })
    );
  }

}
