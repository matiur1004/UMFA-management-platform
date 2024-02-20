import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {BranchManagerService} from '@services';
import {Subscription} from 'rxjs';

@Component({
  selector: 'page-branch-detect',
  templateUrl: './page-branch-detect.component.html',
  styleUrls: ['./page-branch-detect.component.less']
})
export class PageBranchDetectComponent implements OnInit, OnDestroy {
  private branchSub: Subscription;

  constructor(
    private branchManager: BranchManagerService,
    private router: Router
  ) {
  }

  ngOnInit() {
    const branchId = this.branchManager.getBranchId();
    if (branchId) {
      this.redirectToBrunch(branchId);
    } else {
      this.branchSub = this.branchManager.getAllBranches().subscribe(() => {
        const branchId = this.branchManager.getBranchId();
        this.redirectToBrunch(branchId ? branchId : null);
      });
    }
  }

  ngOnDestroy() {
    this.branchSub && this.branchSub.unsubscribe();
  }

  redirectToBrunch(branchId: string) {
    this.router.navigate(['/branch', branchId], {replaceUrl: true});
  }

}
