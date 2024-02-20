import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {DepartmentViewModel} from '@models';
import {UserContactViewModel} from '../../models/user-contact.model';
import {Subject, Subscription} from 'rxjs';
import {OperationsAgreementContactViewModel} from '../../models/operations-agreement.model';

@Component({
  selector: 'operations-agreement-contacts',
  templateUrl: './operations-agreement-contacts.component.html',
  styleUrls: ['./operations-agreement-contacts.component.less']
})
export class OperationsAgreementContactsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() agreementContact: OperationsAgreementContactViewModel;
  @Input() departments = new Array<DepartmentViewModel>();
  @Input() allContacts = new Array<UserContactViewModel>();
  @Input() validationNotify: Subject<any>;

  @Output() agreementContactChange = new EventEmitter<OperationsAgreementContactViewModel>();

  contact: UserContactViewModel;
  department: DepartmentViewModel;
  isSubmited = false;
  validationSubscription: Subscription;
  departmentContacts = new Array<UserContactViewModel>();

  validationMessages = {
    departments: 'Select department to continue',
    contacts: 'At least on contact person is required'
  };

  constructor() {
  }

  ngOnInit() {
    if (this.validationNotify) {
      this.validationSubscription = this.validationNotify.subscribe((value) => {
        this.isSubmited = true;
      });
    }

    this.department = this.departments.find(d => d.id === this.agreementContact.departmentId);
  }

  refreshContacts() {
    this.departmentContacts = this.allContacts.filter(c => c.departments.filter(id => id === this.agreementContact.departmentId).length);
  }

  onDepartmentChange(department) {
    this.agreementContact.departmentId = department.id;
    this.agreementContact.userId = null;
    this.agreementContact.contactId = null;
    this.agreementContactChange.emit(this.agreementContact);

    this.department = department;
    this.contact = null;
    this.refreshContacts();
  }

  onContactChange(contact: UserContactViewModel) {
    this.agreementContact.userId = contact.userId;
    this.agreementContact.contactId = contact.contactId;
    this.agreementContactChange.emit(this.agreementContact);
    this.contact = contact;
  }

  ngOnChanges(changes: any) {
    let contacts: Array<UserContactViewModel> = changes.allContacts.currentValue;
    if (contacts) {
      this.allContacts = contacts;
      this.refreshContacts();
      let contactUserId = this.agreementContact.contactId != null
        ? this.agreementContact.contactId
        : this.agreementContact.userId;

      if (contactUserId)
        this.contact = this.departmentContacts.find(c => c.userId === contactUserId || c.contactId === contactUserId);
    }
  }

  ngOnDestroy() {
    if (this.validationSubscription) {
      this.validationSubscription.unsubscribe();
    }
  }

}
