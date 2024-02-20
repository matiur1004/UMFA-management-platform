import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common'
import {Subject, Subscription} from 'rxjs';
import {NgbNav} from '@ng-bootstrap/ng-bootstrap';
import {StringExtension} from 'app/shared/helper/string-extension';
import {BranchManagerService, PermissionService, UserProfileService} from '@services';
import {BranchAccessPermission} from '@models';

@Component({
  selector: 'user-profiles-page',
  templateUrl: './user-profiles-page.component.html',
  styleUrls: ['./user-profiles-page.component.less']
})
export class UserProfilesPageComponent implements OnInit {

  @ViewChild('searchBox') searchBox;
  @ViewChild("nav") tabs: NgbNav;
  searchTermsSubject = new Subject<string>();
  public branchId: string;
  accessPermission: BranchAccessPermission;
  active: any = "tab-0"
  private permissionChangedSubject$: Subscription;
  private branchSubscruber$: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userProfileService: UserProfileService,
    private location: Location,
    private permissionService: PermissionService,
    private branchManagerService: BranchManagerService
  ) {
  }


  ngOnInit() {

    this.accessPermission = this.permissionService.branchAccessPermission;
    this.permissionChangedSubject$ = this.permissionService.getBranchPermissionChangedSubject().subscribe(accessPermission => {
      this.accessPermission = accessPermission;
    });

    this.branchId = this.branchManagerService.getBranchId()
  }

  ngOnDestroy() {
    this.permissionChangedSubject$.unsubscribe();
  }

  ngAfterViewInit() {
    this.activatedRoute.params.subscribe(params => {
      let userId = params['userId'];

      if (StringExtension.isGuid(userId)) {
        this.userProfileService.selectedUserId = userId;
        this.location.replaceState('/branch' + this.branchId + '/user-profiles');
        setTimeout(() => {
          this.tabs.select('tab-1');
        }, 0);
      }
    });
  }

  onCreate() {
    this.router.navigate(['/branch', this.branchId, 'user-profiles', 'new']);
  }

  onTabChange() {
    this.searchBox.nativeElement.value = '';
  }

  search(term: string): void {
    this.searchTermsSubject.next(term);
  }
}
