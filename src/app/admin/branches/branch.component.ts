import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {BranchManagerService} from '@services';
import {ContactInformationViewModel} from '@models';
import {FileExtension} from 'app/shared/helper/file-extension';
import {CropImageComponent} from '../../widgets/uploadImage/crop-image.component';

import {BranchUserViewModel, BranchViewModel} from './models/branch.model';
import {BranchService} from './branch.service';
import {EditBranchBankAccountsComponent} from './components/add-bank-accounts/add-bank-accounts.component';


@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.less']
})
export class BranchComponent implements OnInit {

  @Input() model: BranchViewModel;
  @Output() edit: EventEmitter<any> = new EventEmitter();
  form: FormGroup;
  formErrors = {
    'name': '',
    'email': '',
    'phone': '',
    'registeredName': '',
    'registeredNumber': '',
    'vatNumber': '',

  }
  validationMessages = {
    'name': {
      'required': 'Name is required',
    },
    'registeredName': {
      'required': 'Registered Name is required',
    },
    'registeredNumber': {
      'required': 'registered Number is required',
    },
    'vatNumber': {
      'required': 'Vat Number is required',
    },
    'phone': {
      'required': 'Phone is required',
      'pattern': 'Phone number is not in the correct format'
    },
    'email': {
      'required': 'Email is required',
      'pattern': 'Email address is not in the correct format'
    }
  }
  private phoneContactLabels: string[];
  private externalLinkLabels: string[];

  constructor(
    private branchService: BranchService,
    private cdRef: ChangeDetectorRef,
    private branchManager: BranchManagerService,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.createForm();
    this.phoneContactLabels = this.branchService.phoneContactLabels;
    this.externalLinkLabels = this.branchService.externalLinkLabels;
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: [this.model.name, Validators.required],
      registeredName: [this.model.registeredName, Validators.required],
      registeredNumber: [this.model.registeredNumber, Validators.required],
      vatNumber: [this.model.vatNumber, Validators.required],
      phone: [this.model.phone, [Validators.required, Validators.pattern(/^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/)]],
      physicalAddress: [{
        line1: this.model.physicalAddress.line1,
        line2: this.model.physicalAddress.line2,
        suburb: this.model.physicalAddress.suburb,
        city: this.model.physicalAddress.city,
        code: this.model.physicalAddress.code,
        province: this.model.physicalAddress.province,
        country: this.model.physicalAddress.country,
        description: this.model.physicalAddress.description
      }],
      postAddress: [{
        line1: this.model.postAddress.line1,
        line2: this.model.postAddress.line2,
        suburb: this.model.postAddress.suburb,
        city: this.model.postAddress.city,
        code: this.model.postAddress.code,
        province: this.model.postAddress.province,
        country: this.model.postAddress.country,
        description: this.model.postAddress.description
      }],
      email: [this.model.email, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]]
    });
  }

  onFormUpdate() {
    this.onValueFormChange();
    this.updateBranch();
  }

  onValueFormChange(data?: any) {
    if (!this.form) return;
    let form = this.form;
    for (let field in this.formErrors) {
      this.formErrors[field] = "";
      let control = form.get(field);
      if ((control && control.dirty && control.invalid)) {
        let message = this.validationMessages[field];
        for (let key in control.errors) {
          this.formErrors[field] = message[key];
        }
      }
    }
  }

  updateBranch() {
    if (this.form.valid) {
      this.model.name = this.form.value.name;
      this.model.registeredName = this.form.value.registeredName;
      this.model.registeredNumber = this.form.value.registeredNumber;
      this.model.vatNumber = this.form.value.vatNumber;
      this.model.email = this.form.value.email;
      this.model.phone = this.form.value.phone;
      this.model.physicalAddress = this.form.value.physicalAddress;
      this.model.postAddress = this.form.value.postAddress;
      this.branchService.update(this.model).subscribe();
    } else {
      this.onValueFormChange();
    }
  }

  logoChanged(file) {
    this.branchService.updateLogo(this.model.id, file).subscribe((response: string) => {
      this.model.logoUrl = response;
    });
  }

  adminLogoChanged(data, idx) {
    let admin = this.model.admins[idx];
    let file = FileExtension.dataURLtoFile(data, admin.id + ".png");

    this.branchService.updateAdminLogo(admin.id, file).subscribe((response: string) => {
      admin.logoUrl = response;
    });
  }

  onImageError(admin: BranchUserViewModel) {
    admin.showAbbreviation = true;
  }

  fileChangeEvent(file: File, index: number): void {
    const modalRef = this.modalService.open(CropImageComponent, {backdrop: 'static'});
    modalRef.componentInstance.file = file;
    modalRef.componentInstance.maintainAspectRatio = true;
    modalRef.componentInstance.aspectRatio = 1;
    modalRef.result.then((result) => {
      this.model.admins[index].showAbbreviation = false;
      this.model.admins[index].logoUrl = result;
      this.adminLogoChanged(result, index);

      // fix bug with scroll when opened two modals
      if (document.querySelector('body > .modal')) {
        document.body.classList.add('modal-open');
      }
    }, (reason) => {
    });
  }

  expandToggle() {
    if (this.model.isDetailed) {
      this.model.isDetailed = false;
    } else {
      this.branchService.get(this.model.id).subscribe((branch) => {
        let logo = this.model.logo;
        let logoUrl = this.model.logoUrl;
        Object.assign(this.model, branch);
        this.model.logo = logo;
        this.model.logoUrl = logoUrl;

        this.model.isDetailed = true;
      });
    }
  }

  addPhoneContact(event) {
    event.preventDefault();

    let phoneContact = new ContactInformationViewModel();
    phoneContact.label = this.phoneContactLabels[0];
    phoneContact.value = '';

    this.model.phoneContacts.push(phoneContact);
  }

  addExternalLink(event) {
    event.preventDefault();

    let externalLink = new ContactInformationViewModel();
    externalLink.label = this.externalLinkLabels[0];
    externalLink.value = '';

    this.model.externalLinks.push(externalLink);
  }

  updatePhoneContact(index) {
    let phoneContact = this.model.phoneContacts[index];
    if (phoneContact.id && phoneContact.value) {
      this.branchService.updateContactInformation(phoneContact, this.model.id, phoneContact.id).subscribe();
    } else if (phoneContact.value) {
      this.branchService.addContactInformation(phoneContact, this.model.id).subscribe((contactInformation) => {
        this.model.phoneContacts[index] = contactInformation;
      });
    }
  }

  updateExternalLink(index) {
    let externalLink = this.model.externalLinks[index];

    if (externalLink.id && externalLink.value) {
      this.branchService.updateContactInformation(externalLink, this.model.id, externalLink.id).subscribe();
    } else if (externalLink.value) {
      this.branchService.addContactInformation(externalLink, this.model.id).subscribe((externalLink) => {
        this.model.externalLinks[index] = externalLink;
      });
    }
  }

  removePhoneContact(index) {
    if (this.model.phoneContacts[index].id) {
      this.branchService.deleteContactInformation(this.model.id, this.model.phoneContacts[index].id).subscribe(() => {
        this.model.phoneContacts.splice(index, 1);
      });
    } else {
      this.model.phoneContacts.splice(index, 1);
    }
  }

  removeExternalLink(index) {
    if (this.model.externalLinks[index].id) {
      this.branchService.deleteContactInformation(this.model.id, this.model.externalLinks[index].id).subscribe(() => {
        this.model.externalLinks.splice(index, 1);
      });
    } else {
      this.model.externalLinks.splice(index, 1);
    }
  }

  updateBankAccount(idx: number) {
    let bankAccount = this.model.bankAccounts[idx];
    if (bankAccount.id) {
      this.branchService.updateBankAccount(bankAccount, this.model.id, bankAccount.id).subscribe();
    } else {
      this.branchService.addBankAccount(bankAccount, this.model.id).subscribe((response) => {
        bankAccount.id = response.id;
      });
    }
  }

  removeBankAccount(idx: number) {
    let bankAccount = this.model.bankAccounts[idx];

    this.branchService.deleteBankAccount(this.model.id, bankAccount.id).subscribe(() => {
      this.model.bankAccounts.splice(idx, 1);
    });
  }

  openTab(tabIndex: number, detailedBankAccount: boolean) {
    this.edit.emit({tabIndex: tabIndex, detailedBankAccount: detailedBankAccount});
  }

  addBankAccount() {
    const modalRef = this.modalService.open(EditBranchBankAccountsComponent);
    modalRef.componentInstance.branchId = this.model.id;
    modalRef.result.then((result) => {
      this.model.bankAccounts.push(result);
    }, (reason) => {
    });
  }

  goToBranch(event) {
    event.stopPropagation();
    this.branchManager.branchChanged(this.model.id);
    this.branchManager.getAllBranches(this.model.id);
    this.router.navigate(['/']);
  }

}
