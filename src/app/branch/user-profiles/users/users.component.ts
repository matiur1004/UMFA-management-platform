import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {
  AddressViewModel,
  ContactInformationType,
  PagingViewModel,
  UserProfileUserViewModel,
  UserProfileViewModel
} from '@models';
import {BranchManagerService, BranchSettingsService, UserProfileService} from '@services';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {DeleteDialogComponent} from 'app/widgets/delete-dialog/delete-dialog.component';

@Component({
  selector: 'user-profile-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit, OnDestroy {

  @Input() searchTermsSubject = new Subject<string>();
  model: PagingViewModel<UserProfileUserViewModel> = new PagingViewModel<UserProfileUserViewModel>();
  userProfiles: UserProfileViewModel[] = new Array<UserProfileViewModel>();
  selectedUserProfile: UserProfileViewModel;
  pageSize: number = 30;
  page: number = 1;
  maxContCount: number = 3;
  orderIndex: number = 1;
  branchAddresses: AddressViewModel[] = new Array<AddressViewModel>();
  searchTerms: string = null;
  private branchSubscruber: Subscription;
  private searchTermsSubscriber: Subscription;

  constructor(
    private userProfileService: UserProfileService,
    private branchService: BranchSettingsService,
    private branchManagerService: BranchManagerService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.userProfileService.getUserProfiles().subscribe(response => {

      this.userProfiles = response.items;

      this.loadData();
      this.getBranchAddresses(this.branchManagerService.getCurrentBranch().id);
    });


    this.branchSubscruber = this.branchManagerService.getBranchObservable().subscribe((branch) => {
      this.loadData();
      this.getBranchAddresses(branch.id);
    });

    this.searchTermsSubscriber = this.searchTermsSubject.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      tap((term: string) => {
        this.searchTerms = term;
        this.loadData();
      }),
    ).subscribe();

  }

  ngOnDestroy(): void {
    this.branchSubscruber.unsubscribe();
    this.searchTermsSubscriber.unsubscribe();
  }

  onUserProfileChanged(userProfile) {
    this.selectedUserProfile = userProfile;
    this.loadData();
  }

  loadData() {

    forkJoin([this.userProfileService.getUsers(this.searchTerms, this.selectedUserProfile ? this.selectedUserProfile.id : '', this.orderIndex, this.page * this.pageSize - this.pageSize, this.pageSize),
      this.userProfileService.getDepartments()]).subscribe(data => {
      data[0].items.forEach(user => {
        if (user.logoUrl) {
          user.logoUrl = user.logoUrl + '?' + Math.random();
        }

        user.departmentDescription = user.departments.filter(ud => data[1].find(d => d.id == ud.id) != null).slice(0, 3).map(d => d.name).join(", ");
        user.contactExternalLinks = user.contactInformations.filter(c => ContactInformationType.externalLinkLabels().includes(c.label));
        user.contactPhoneNumbers = user.contactInformations.filter(c => ContactInformationType.phoneContactLabels().includes(c.label));
      });

      this.model = data[0];
      if (this.userProfileService.selectedUserId) {
        let user = this.model.items.find(u => u.id == this.userProfileService.selectedUserId);
        if (user)
          this.onEdit(event, user);

        this.userProfileService.selectedUserId = null;
      }
    });
  }

  getBranchAddresses(branchId: string) {
    this.branchAddresses = [];
    this.branchService.get(branchId).subscribe((branch) => {
      this.branchAddresses.push(branch.physicalAddress);
      this.branchAddresses.push(branch.postAddress);
    });
  }

  onCreate() {
    const modalRef = this.modalService.open(UserDetailComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = new UserProfileUserViewModel();
    modalRef.componentInstance.isNew = true;
    modalRef.componentInstance.initAddresses(this.branchAddresses);
    modalRef.result.then((shouldReload) => {
      if (shouldReload) {
        this.loadData();
      }
    }, () => {
    });
  }

  onEdit(event: any, user) {
    if (event.target && event.target.classList && (event.target.classList.contains('dropdown-toggle') || event.target.classList.contains('on-disable') || event.target.classList.contains('on-delete')))
      return;

    const modalRef = this.modalService.open(UserDetailComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = user;
    modalRef.componentInstance.isNew = false;
    modalRef.result.then(shouldReload => {
      if (shouldReload) {
        this.loadData();
      }
    }, () => {
    });
  }

  onDelete(user, idx) {

    const modalRef = this.modalService.open(DeleteDialogComponent);
    modalRef.result.then((result) => {
      this.userProfileService.deleteUser(user.id).subscribe(response => {
        this.model.items.splice(idx, 1);
        this.model.total -= this.model.total;
      });
    }, () => {
    });
  }

  changeOrderIndex(idx) {
    if (this.orderIndex == idx || (this.orderIndex == (idx * -1)))
      this.orderIndex *= -1;
    else
      this.orderIndex = idx;

    this.loadData();
  }

  setPage(page: number) {
    this.page = page;
    this.loadData();
  }

  onPageSizeChanged(pageSize) {
    if (this.pageSize == pageSize)
      return;

    this.pageSize = pageSize;
    this.page = 1;
    this.loadData();
  }

  getItemsDetails() {
    let text = '';

    if (this.pageSize) {
      let start = this.page * this.pageSize - this.pageSize + 1;
      let end = this.page * this.pageSize;

      if (start > this.model.total) {
        start = this.model.total;
      }
      if (end > this.model.total) {
        end = this.model.total;
      }

      text = 'Showing {start}-{end} of {total} user(s)';
      text = text.replace('{start}', start.toString());
      text = text.replace('{end}', end.toString());
      text = text.replace('{total}', this.model.total.toString());
    } else {
      text = 'Showing all {total} users';
      text = text.replace('{total}', this.model.total.toString());
    }

    return text;
  }

  onApproval(user) {
    this.userProfileService.sendOnApprove(user.id).subscribe();
  }

  onDisable(user) {
    this.userProfileService.disableUser(user.id).subscribe(r => {
      user.isApproved = !user.isApproved;
    });
  }
}
