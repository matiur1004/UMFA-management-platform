import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BranchManagerService, BranchSettingsService, UserProfileService} from '@services';
import {forkJoin, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {AddressViewModel, ContactInformationType, ContactViewModel, PagingViewModel} from '@models';
import {CreateBranchContactComponent} from 'app/branch/create-branch-contact/create-branch-contact.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'user-profile-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.less']
})
export class ContactsComponent implements OnInit, OnDestroy {

  @Input() searchTermsSubject = new Subject<string>();

  model: PagingViewModel<ContactViewModel> = new PagingViewModel<ContactViewModel>();
  pageSize: number | null = 10;
  page: number = 1;
  orderIndex: number = 1;
  noItems: boolean;
  itemsPerPageList = [10, 30, 50, 100];
  branchAddresses: AddressViewModel[] = new Array<AddressViewModel>();

  private branchSubscruber: Subscription;
  private searchTermsSubscriber: Subscription;
  private searchTerms: string = '';

  constructor(
    private userProfileService: UserProfileService,
    private branchService: BranchSettingsService,
    private branchManagerService: BranchManagerService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.loadData();
    this.getBranchAddresses(this.branchManagerService.getCurrentBranch().id);

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
        this.loadData(false);
      }),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.branchSubscruber.unsubscribe();
    this.searchTermsSubscriber.unsubscribe();
  }

  getBranchAddresses(branchId: string) {
    this.branchAddresses = [];
    this.branchService.get(branchId).subscribe((branch) => {
      this.branchAddresses.push(branch.physicalAddress);
      this.branchAddresses.push(branch.postAddress);
    });
  }

  loadData(reCalItems: boolean = true) {

    forkJoin([this.userProfileService.getContactsForClient(this.searchTerms, this.orderIndex, this.page * this.pageSize - this.pageSize, this.pageSize),
      this.userProfileService.getDepartments()]).subscribe(data => {
      data[0].items.forEach(contact => {
        if (contact.logoUrl) {
          contact.logoUrl = contact.logoUrl + '?' + Math.random();
        }

        contact.departmentDescription = contact.departments.filter(ud => data[1].find(d => d.id == ud.id) != null).slice(0, 3).map(d => d.name).join(", ");
        contact.contactExternalLinks = contact.contactInformations.filter(c => ContactInformationType.externalLinkLabels().includes(c.label));
        contact.contactPhoneNumbers = contact.contactInformations.filter(c => ContactInformationType.phoneContactLabels().includes(c.label));
      });

      this.model = data[0];
      if (reCalItems)
        this.noItems = !data[0].total;
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

  setItemsPerPage(value: number | null) {
    if (value > this.model.total) {
      this.page = 1;
    }
    this.pageSize = value;
    this.loadData();
  }

  onCreate() {
    const modalRef = this.modalService.open(CreateBranchContactComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = new ContactViewModel();
    modalRef.componentInstance.isNew = true;
    modalRef.componentInstance.initAddresses(this.branchAddresses);
    modalRef.result.then((shouldReload) => {
      if (shouldReload) {
        this.loadData();
      }
    }, () => {
    });
  }

  onEdit(event: any, contact) {
    if (event.target && (event.target.classList.contains('dropdown-toggle') || event.target.classList.contains('on-delete') || event.target.classList.contains('on-make-user')))
      return;

    const modalRef = this.modalService.open(CreateBranchContactComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = contact;
    modalRef.componentInstance.isNew = false;
    modalRef.result.then(shouldReload => {
      if (shouldReload) {
        this.loadData();
      }
    }, () => {
    });
  }


  onDelete(contact: ContactViewModel) {
    this.userProfileService.deleteContact(contact.id).subscribe(c => this.loadData());
  }

  onMakeUser(contact, idx) {
    this.userProfileService.createUserFromContact(contact.id).subscribe(resp => {
      this.model.items.splice(idx, 1);
      this.model.total -= this.model.total;
    });
  }
}
