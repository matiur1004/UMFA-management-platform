import {Injectable} from '@angular/core';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import {AsyncSubject, Observable, ReplaySubject, Subject} from 'rxjs';

import {BranchModel} from '@models';
import {HttpHelperService} from './http-helper.service';
import {PermissionService} from './permission.service';
import {finalize} from 'rxjs/operators';

@Injectable()
export class BranchManagerService {

  public branches: BranchModel[] = new Array<BranchModel>();
  private readonly BRANCH_ID: string = 'branchId';
  private branchChangedSubject = new ReplaySubject<BranchModel>(1);
  private branchesChangedSubject = new Subject<BranchModel[]>();
  private currentBranch: BranchModel = new BranchModel();
  private readonly BRANCHES_URL: string = '/api/v1/branches';
  private readonly UPDATE_LAST_BRANCH: string = '/api/v1/account/update-last-branch/{0}';

  constructor(
    private httpHelper: HttpHelperService,
    private localStorage: LocalStorageService,
    private permService: PermissionService
  ) {
  }

  getBranchId() {
    return this.localStorage.get(this.BRANCH_ID);
  }

  public getBranchesObservable(): Observable<BranchModel[]> {
    return this.branchesChangedSubject.asObservable();
  }

  public getBranchObservable(): Observable<BranchModel> {
    return this.branchChangedSubject.asObservable();
  }

  public branchChanged(branchId: string): void {
    const branch = this.branches.find(b => b.id === branchId);
    if (branch && branch !== this.currentBranch) {
      this.updateLastBranch(branchId);
      branch.isSelected = true;
      this.currentBranch = branch;
      this.branchChangedSubject.next(branch);
      this.permService.refreshBranchPermissions();
    }
  }

  public getBranches(): BranchModel[] {
    return this.branches;
  }

  public getCurrentBranch(): BranchModel {
    return this.currentBranch;
  }

  public getAllBranches(branchId: string = null): AsyncSubject<any[]> {
    const branchesLoaded = new AsyncSubject<any[]>();
    this.httpHelper.authJsonGet<BranchModel[]>(this.BRANCHES_URL).pipe(
      finalize(() => branchesLoaded.complete())
    ).subscribe((branches) => {
      this.branches = branches;

      const branch = this.branches.find(b => b.id === branchId);

      this.branchesChangedSubject.next(branches);
      if (branch) {
        this.branchChanged(branch.id);
      } else {
        this.setFirstBranch();
      }
      branchesLoaded.next(this.branches);
    });
    return branchesLoaded;
  }

  public setFirstBranch() {
    if (this.branches.length > 0) {
      this.branchChanged(this.branches[0].id);
    }
  }

  public resetBranch() {
    this.currentBranch = new BranchModel();
    this.currentBranch.name = 'All branches';
    this.branchChangedSubject.next(this.currentBranch);
  }

  private updateLastBranch(branchId: string) {
    this.localStorage.set(this.BRANCH_ID, branchId);
    this.httpHelper.authJsonPost(this.UPDATE_LAST_BRANCH.replace('{0}', branchId), null).subscribe();
  }
}
