import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PopupCreateTenantComponent} from 'app/popups/popup.create.tenant/popup.create.tenant.component';
import {Subject} from 'rxjs';
import {ContactInformationType, PagingViewModel, TenantViewModel} from '@models';
import {NationalTenantsService, TenantService} from "@services";
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {DeleteDialogComponent} from 'app/widgets/delete-dialog/delete-dialog.component';

@Component({
  selector: 'tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.less']
})
export class TenantsComponent implements OnInit {

  model: PagingViewModel<TenantViewModel> = new PagingViewModel<TenantViewModel>();
  nationalTenantsDictionary = {};
  nationalTenantsList = [];
  searchTerms: string;
  offset: number = 0;
  pageSize: number = 10;
  orderIndex: number = 1;
  page: number = 1;
  pages: number[];
  buildingId: string;
  itemsPerPageList = [10, 30, 50, 100];
  private searchTermsSubject = new Subject<string>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private tenantService: TenantService,
    private nationalTenantService: NationalTenantsService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.loadData();

    this.getNationalTenants();

    this.searchTermsSubject.pipe(
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
    this.activatedRoute.parent.parent.params.subscribe(params => {
      this.buildingId = params['id'];

      this.tenantService.getAll(this.buildingId, this.searchTerms, this.orderIndex, this.page * this.pageSize - this.pageSize, this.pageSize).subscribe((response) => {
        response.items.forEach(contact => {
          contact.contactExternalLinks = contact.contactInformations.filter(c => ContactInformationType.externalLinkLabels().includes(c.label));
          contact.contactPhoneNumbers = contact.contactInformations.filter(c => ContactInformationType.phoneContactLabels().includes(c.label));
        });

        this.model = response;
      });
    });
  }

  onCreate() {
    const modalRef = this.modalService.open(PopupCreateTenantComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = new TenantViewModel();
    modalRef.componentInstance.nationalTenantsList = this.nationalTenantsList;
    modalRef.componentInstance.isNew = true;
    modalRef.componentInstance.buildingId = this.buildingId;
    modalRef.result.then((shouldReload) => {
      if (shouldReload) {
        this.loadData();
      }
    }, () => {
    });
  }

  onEdit(event: any, tenant) {
    if (event.target && (event.target.classList.contains('dropdown-toggle') || event.target.classList.contains('on-delete')))
      return;

    const modalRef = this.modalService.open(PopupCreateTenantComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = tenant;
    modalRef.componentInstance.nationalTenantsList = this.nationalTenantsList;
    modalRef.componentInstance.isNew = false;
    modalRef.componentInstance.buildingId = this.buildingId;
    modalRef.result.then(shouldReload => {
      if (shouldReload) {
        this.loadData();
      }
    }, () => {
    });
  }

  onDelete(tenant) {
    const modalRef = this.modalService.open(DeleteDialogComponent);
    modalRef.result.then((result) => {
      this.tenantService.delete(this.buildingId, tenant.id).subscribe(() => {
        this.loadData();
      });
    }, (reason) => {
    });
  }

  search(term: string): void {
    this.searchTermsSubject.next(term);
  }

  setItemsPerPage(value: number | null) {
    if (value > this.model.total) {
      this.page = 1;
    }
    this.pageSize = value;
    this.loadData();
  }

  setPage(page: number) {
    this.page = page;
    this.loadData();
  }

  changeOrderIndex(idx) {
    if (this.orderIndex == idx || (this.orderIndex == (idx * -1)))
      this.orderIndex *= -1;
    else
      this.orderIndex = idx;

    this.loadData();
  }

  getNationalTenants() {
    this.nationalTenantService.getNationalTenants().subscribe(res => {
      this.nationalTenantsDictionary = res.reduce((result, item) => {
        result[item.id] = item.name;
        return result;
      }, {});
      this.nationalTenantsList = res.map(item => {
        return {
          id: item.id,
          name: item.name
        }
      });
      this.nationalTenantsList.unshift({
        id: null,
        name: 'No National Tenants'
      });
    });
  }
}
