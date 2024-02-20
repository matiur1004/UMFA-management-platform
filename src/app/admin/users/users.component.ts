import {Component, OnInit} from '@angular/core';
import {PagingViewModel} from '@models';
import {UserViewModel} from './shared/model/user.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from './shared/user.service';
import {UserContainerComponent} from './user-detail/user-container/user-container.component';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, take, tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {StringExtension} from 'app/shared/helper/string-extension';
import {Location} from '@angular/common'
import {DeleteDialogComponent} from '@app/widgets/delete-dialog/delete-dialog.component';

@Component({
  selector: 'global-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {

  model: PagingViewModel<UserViewModel> = new PagingViewModel<UserViewModel>();
  searchTerms: string = '';
  pageSize: number = 30;
  page: number = 1;
  itemsPerPageList = [30, 50, 100];
  orderIndex: number = 1;
  private searchTermsSubject = new Subject<string>();

  constructor(private modalService: NgbModal, private userService: UserService, private activatedRoute: ActivatedRoute, private location: Location) {
  }

  ngOnInit() {

    this.loadData();

    this.searchTermsSubject.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      tap((term: string) => {
        this.searchTerms = term;
        this.page = 1;
        this.loadData();
      }),
    ).subscribe();
  }

  search(term: string): void {
    this.searchTermsSubject.next(term);
  }

  loadData() {
    this.userService.getUsers(this.searchTerms, this.orderIndex, this.pageSize * this.page - this.pageSize, this.pageSize).subscribe(response => {
      response.items = response.items.map(u => {
        if (u.logoUrl) {
          u.logoUrl = u.logoUrl + '?' + Math.random();
        }

        u.departmentDescription = u.departments.join(', ');
        return u;
      });

      this.model = response;
    })
  }

  onPageSizeChanged(pageSize) {
    if (this.pageSize == pageSize)
      return;

    this.pageSize = pageSize;
    this.page = 1;
    this.loadData();
  }

  ngAfterViewInit() {
    this.activatedRoute.params.subscribe(params => {
      let userId = params['userId'];

      if (StringExtension.isGuid(userId)) {
        let user = new UserViewModel();
        user.id = userId
        this.onEdit(event, userId);
        this.location.replaceState('/admin/users');
      }
    });
  }

  onEdit(event: any, userId: string) {
    event.stopPropagation();

    const classNames = ['dropdown-toggle', 'approve', 'dropdown-delete'];

    if (event.target && this.containsClass(classNames, event))
      return;

    this.userService.getUser(userId).pipe(take(1)).subscribe(response => {
      const modalRef = this.modalService.open(UserContainerComponent, {backdrop: 'static'});

      modalRef.componentInstance.model = response;
      modalRef.componentInstance.isNew = false;
      modalRef.result.then(shouldReload => {
        if (shouldReload) {
          this.loadData();
        }
      }, () => {
      });
    });
  }

  onDelete(userId: string) {
    const modalRef = this.modalService.open(DeleteDialogComponent, {backdrop: 'static'});

    modalRef.result.then(() => {
      this.userService.deleteUser(userId).subscribe(() => {
        this.loadData();
      });
    }, () => {
    });
  }

  onStatusChanged(user: UserViewModel) {
    this.userService.updateUserStatus(user.id, !user.isApproved).subscribe(r => {
      user.isApproved = !user.isApproved;
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

  containsClass(classNames: string[], event) {
    for (let i = 0; i < classNames.length; i++) {
      const className = classNames[i];

      if (event.target.classList.contains(className))
        return true;
    }
  }
}
