import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {HttpHelperService} from './http-helper.service';
import {BranchAccessPermission, MCAccessPermission} from '@models';
import {Observable, Subject, Subscription} from 'rxjs';
import {filter, map, mergeMap, tap} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  public mcAccessPermission: MCAccessPermission = new MCAccessPermission();
  public branchAccessPermission: BranchAccessPermission = new BranchAccessPermission();
  private readonly BRANCH_PERMISSION_URL: string = '/api/v1/branches/permission';
  private readonly MC_PERMISSION_URL: string = '/api/v1/managment-companies/permission';
  private currentAccessBranchPermissions: string[] = new Array<string>();
  private mcPermissionChangedSubject = new Subject<any>();
  private branchPermissionChangedSubject = new Subject<any>();
  private refreshBranchPermissionsSub: Subscription;
  private refreshPermissionsSub: Subscription;

  constructor(private httpHelperService: HttpHelperService, private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {

    this.router
      .events
      .pipe(filter(e => e instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute.firstChild;
          let child = route;

          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
              route = child;
            } else {
              child = null;
            }
          }

          return route;
        }),
        mergeMap(route => route.data))
      .subscribe(data => {

        if (!data['roles']) {
          this.currentAccessBranchPermissions = new Array<string>();
        } else {
          this.currentAccessBranchPermissions = data['roles'];
        }
      });

  }

  public getMCPermissionChangedSubject(): Observable<any> {
    return this.mcPermissionChangedSubject.asObservable();
  }

  public getBranchPermissionChangedSubject(): Observable<any> {
    return this.branchPermissionChangedSubject.asObservable();
  }

  public refreshMCPermissions() {
    this.refreshPermissionsSub = this.httpHelperService.authJsonGet<MCAccessPermission>(this.MC_PERMISSION_URL).subscribe(permission => {
      this.mcAccessPermission = permission;
      this.mcPermissionChangedSubject.next(permission);
    });
  }

  public refreshBranchPermissions() {
    this.refreshBranchPermissionsSub = this.httpHelperService.authJsonGet<BranchAccessPermission>(this.BRANCH_PERMISSION_URL).subscribe(response => {
      this.branchAccessPermission = response;
      this.branchPermissionChangedSubject.next(response);

      if (this.currentAccessBranchPermissions.length > 0) {

        let canActivate: boolean = false;
        this.currentAccessBranchPermissions.forEach(r => {
          if (this.branchAccessPermission[r]) {
            canActivate = true;
          }
        });

        if (!canActivate) {
          this.router.navigate(['/']);
        }
      }
    });
  }

  public getMCPermissions() {
    return this.httpHelperService.authJsonGet<MCAccessPermission>(this.MC_PERMISSION_URL).pipe(tap(permission => {
      this.mcAccessPermission = permission;
      this.mcPermissionChangedSubject.next(permission);
    }));
  }

  public getBranchPermissions() {
    return this.httpHelperService.authJsonGet<BranchAccessPermission>(this.BRANCH_PERMISSION_URL).pipe(tap(permission => {
      this.branchAccessPermission = permission;
      this.branchPermissionChangedSubject.next(permission);
    }));
  }

}
