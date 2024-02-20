import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateClientContactComponent} from 'app/branch/create-client-contact/create-client-contact.component';
import {ClientViewModel} from '../shared/client.model';
import {ClientService} from '../shared/client.service';
import {ContactInformationType, ContactViewModel, PagingViewModel} from '@models';
import {DeleteDialogComponent} from 'app/widgets/delete-dialog/delete-dialog.component';

@Component({
  selector: 'client-contacts',
  templateUrl: './client-contacts.component.html',
  styleUrls: ['./client-contacts.component.less'],
})
export class ClientContactsComponent implements OnInit {

  @Input() model: ClientViewModel;
  contacts: PagingViewModel<ContactViewModel> = new PagingViewModel<ContactViewModel>();
  order = 1;
  pageSize: number | null = 10;
  page = 1;
  itemsPerPageList = [10, 30, 50, 100];

  constructor(private modalService: NgbModal, private clientService: ClientService) {
  }

  ngOnInit() {
    this.loadData();
  }

  onCreate() {
    const modalRef = this.modalService.open(CreateClientContactComponent);
    modalRef.componentInstance.model = new ContactViewModel();
    modalRef.componentInstance.isNew = true;
    modalRef.componentInstance.clientId = this.model.id;
    modalRef.componentInstance.initAddresses(this.model.addresses);
    modalRef.result.then((shouldReload) => {
      if (shouldReload) {
        this.loadData();
      }
    }, () => {
    });
  }

  onEdit(event: any, contact) {
    if (event.target && (event.target.classList.contains('dropdown-toggle') || event.target.classList.contains('on-delete')))
      return;

    const modalRef = this.modalService.open(CreateClientContactComponent);
    modalRef.componentInstance.model = contact;
    modalRef.componentInstance.isNew = false;
    modalRef.componentInstance.clientId = this.model.id;
    modalRef.result.then(shouldReload => {
      if (shouldReload) {
        this.loadData();
      }
    }, () => {
    });
  }

  loadData() {
    this.clientService.getContactsForClient(this.model.id, this.order, this.page * this.pageSize - this.pageSize, this.pageSize).subscribe((response) => {
      response.items.forEach(contact => {
        if (contact.logoUrl) {
          contact.logoUrl = contact.logoUrl + '?' + Math.random();
        }

        contact.departmentDescription = contact.departments.slice(0, 3).map(d => d.name).join(", ");
        contact.contactExternalLinks = contact.contactInformations.filter(c => ContactInformationType.externalLinkLabels().includes(c.label));
        contact.contactPhoneNumbers = contact.contactInformations.filter(c => ContactInformationType.phoneContactLabels().includes(c.label));
      });
      if (this.clientService.selectedClientContact) {
        let currentClientContact = response.items.find(p => p.id == this.clientService.selectedClientContact);
        if (currentClientContact) {
          this.clientService.selectedClientContact = '';
          this.onEdit({}, currentClientContact);
        }
      }
      this.contacts = response;
    });
  }

  changeOrderIndex(idx) {
    if (this.order == idx || (this.order == (idx * -1)))
      this.order *= -1;
    else
      this.order = idx;

    this.loadData();
  }

  setItemsPerPage(value: number | null) {
    if (value > this.contacts.total) {
      this.page = 1;
    }
    this.pageSize = value;
    this.loadData();
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadData();
  }

  onDelete(contact, idx) {
    const modalRef = this.modalService.open(DeleteDialogComponent);
    modalRef.result.then((result) => {
      this.clientService.deleteContact(this.model.id, contact.id).subscribe(() => {
        this.loadData();
      });
    }, (reason) => {
    });
  }

  onDeletePortfolio(client: ClientViewModel, clientPortfolio) {
    const modalRef = this.modalService.open(DeleteDialogComponent);
    modalRef.result.then((result) => {
      this.clientService.deletePortfolio(client.id, clientPortfolio.id).subscribe(() => {
        let idx = client.portfolios.indexOf(clientPortfolio);
        if (idx != -1)
          client.portfolios.splice(idx, 1);
      });
    }, (reason) => {
    });
  }
}
