import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';

import {PagingViewModel, UserProfileViewModel} from '@models';
import {BranchManagerService, UserProfileService} from '@services';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.less']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  @Input() searchTermsSubject = new Subject<string>();

  model: PagingViewModel<UserProfileViewModel> = new PagingViewModel<UserProfileViewModel>();

  pageSize: number = 9;
  page: number = 1;
  itemsPerPageList = [9, 27, 54, 90];
  searchTerms: string = null;
  public branchId: string;
  private branchSubscruber: Subscription;
  private searchTermsSubscriber: Subscription;

  constructor(
    private userProfileService: UserProfileService,
    private branchManagerService: BranchManagerService
  ) {
  }

  ngOnInit() {
    this.branchSubscruber = this.branchManagerService.getBranchObservable().subscribe((branch) => {
      this.branchId = branch.id;
      this.loadData();
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

  loadData() {
    this.userProfileService.getUserProfiles(this.searchTerms, this.page * this.pageSize - this.pageSize, this.pageSize).subscribe(response => {
      this.model = response;
    });
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadData();
  }

  setItemsPerPage(value: number | null) {
    if (value > this.model.total) {
      this.page = 1;
    }
    this.pageSize = value;
    this.loadData();
  }

  ngOnDestroy(): void {
    this.branchSubscruber.unsubscribe();
    this.searchTermsSubscriber.unsubscribe();
  }

  onUserRemove(profile: UserProfileViewModel, index: number) {
    profile.users.splice(index, 1);
  }
}
