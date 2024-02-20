import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService, BranchManagerService, DataService} from '@services';
import {BranchModel} from '@models';
import {Subject, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchService} from 'app/branch/top-bar/shared/search.service';
import {SearchViewModel} from './shared/search.model';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {UserAccountService} from 'app/shared/services/user-account.service';

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.less'],
  animations: [
    trigger('layoutToggle', [
      state('true', style({
        width: '79px'
      })),
      state('false', style({
        width: '202px'
      })),
      transition('true => false', animate('100ms ease-in-out')),
      transition('false => true', animate('100ms ease-in-out'))
    ])
  ],
  providers: [SearchService, UserAccountService]
})
export class TopBarComponent implements OnInit, OnDestroy {

  @Input() isCollapsed: boolean = false;
  public isAllBranchesSelected: boolean = true;
  public branch: BranchModel;
  public branches: BranchModel[] = [];
  fullName: string = '';
  logoUrl: string = '';
  searchModel: SearchViewModel = new SearchViewModel();
  searchTermsSubject = new Subject<string>();
  searchTerm: string;
  private branchSubscruber: Subscription;
  private branchesSubscruber: Subscription;
  private userDataSubscriber: Subscription;
  private searchTermsSubscriber: Subscription;

  constructor(
    private branchManagerService: BranchManagerService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private userAccountService: UserAccountService,
    private dataService: DataService
  ) {
  }

  ngOnInit() {

    this.fullName = this.authService.getFullName();
    this.logoUrl = this.authService.getLogoUrl();

    this.branch = this.branchManagerService.getCurrentBranch();
    this.branches = this.branchManagerService.getBranches();

    this.userDataSubscriber = this.dataService.getUserObservable().subscribe(r => {
      this.fullName = this.authService.getFullName();
      this.logoUrl = this.authService.getLogoUrl();
    });

    this.branchSubscruber = this.branchManagerService.getBranchObservable().subscribe((branch) => {
      this.branch = branch;
      this.isAllBranchesSelected = !branch.isSelected;
    });

    this.branchesSubscruber = this.branchManagerService.getBranchesObservable().subscribe(data => {
      this.branches = data;
    });

    this.searchTermsSubscriber = this.searchTermsSubject.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      tap((term: string) => {
        this.searchService.get(term, 0, 3).subscribe(result => {
          this.searchModel = result;
        });
      }),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.branchSubscruber.unsubscribe();
    this.branchesSubscruber.unsubscribe();
    this.searchTermsSubscriber.unsubscribe();
    this.userDataSubscriber.unsubscribe();
  }

  onBranchSelected(branch: BranchModel) {
    const url = ['/branch', branch.id];
    this.branchManagerService.branchChanged(branch.id);
    const section = this.route.pathFromRoot[2].children[0].url['value'][0] && this.route.pathFromRoot[2].children[0].url['value'][0].path;
    if (section) {
      url.push(section);
    }
    this.router.navigate(url);

    if (this.searchTerm) {
      this.searchService.get(this.searchTerm, 0, 3).subscribe(result => {
        this.searchModel = result;
      });
    }
  }

  displayAll() {
    this.branchManagerService.resetBranch();
  }

  onGlobalSearch(term: string) {
    this.searchTermsSubject.next(term);
  }

  searchItemSelected() {
    this.searchTerm = null;
    this.searchTermsSubject.next('');
  }
}
