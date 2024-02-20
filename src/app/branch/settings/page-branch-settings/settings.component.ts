import {Component, OnInit} from '@angular/core';
import {forkJoin, Subscription} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BranchManagerService, BranchSettingsService} from '@services';

import {BranchViewModel, BuildingViewModel, ContactInformationViewModel, DepartmentViewModel} from '@models';
import {BankAccountDetailComponent} from '../bank-account-detail/bank-account.component';
import {MeterReadingAccountDetailComponent} from '../reading-account-detail/reading-account-detail.component';
import {DeleteDialogComponent} from 'app/widgets/delete-dialog/delete-dialog.component';
import {callFrequencyArray, callFrequencyText} from '../../../shared/models/automaticMeterReadingAccount.model';

@Component({
  selector: 'branch-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class BranchSettingsComponent implements OnInit {

  model: BranchViewModel = new BranchViewModel();
  buildings: BuildingViewModel[];
  amrAccountsBuildings: BuildingViewModel[][] = new Array<BuildingViewModel[]>()
  departmens: DepartmentViewModel[] = new Array<DepartmentViewModel>();
  callFrequencyText = callFrequencyText;
  callFrequencyArray = callFrequencyArray;
  private branchSubscruber: Subscription;
  private phoneContactLabels: string[];
  private externalLinkLabels: string[];

  constructor(
    private branchService: BranchSettingsService,
    private branchManagerService: BranchManagerService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.phoneContactLabels = this.branchService.phoneContactLabels;
    this.externalLinkLabels = this.branchService.externalLinkLabels;

    this.branchSubscruber = this.branchManagerService.getBranchObservable().subscribe((branch) => {
      this.loadData(branch.id);
    });
  }

  loadData(branchId: string) {
    forkJoin([this.branchService.get(branchId), this.branchService.getCompanyDepartments(), this.branchService.getBranchDepartments(), this.branchService.getBuildings(branchId)]).subscribe(data => {
      this.model = data[0];
      this.departmens = data[1].map(d => {
        d.isSelected = data[2].find(bd => d.id == bd.id) != null;
        return d;
      });
      this.buildings = data[3];
      this.getAMRAccoutsBuildings();
    });
  }

  ngOnDestroy(): void {
    this.branchSubscruber.unsubscribe();
  }

  updateBranch() {
    this.branchService.update(this.model).subscribe();
  }

  logoChanged(file) {
    this.branchService.updateLogo(this.model.id, file).subscribe((response: string) => {
      this.model.logoUrl = response;
    });
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
    const phoneContactId = this.model.phoneContacts[index].id;
    if (phoneContactId) {
      this.branchService.deleteContactInformation(this.model.id, phoneContactId).subscribe(() => {
        this.model.phoneContacts.splice(index, 1);
      });
    } else {
      this.model.phoneContacts.splice(index, 1);
    }
  }

  removeExternalLink(index) {
    const externalLinkId = this.model.externalLinks[index].id;
    if (externalLinkId) {
      this.branchService.deleteContactInformation(this.model.id, externalLinkId).subscribe(() => {
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

    const modalRef = this.modalService.open(DeleteDialogComponent);
    modalRef.result.then((result) => {
      let bankAccount = this.model.bankAccounts[idx];

      this.branchService.deleteBankAccount(this.model.id, bankAccount.id).subscribe(() => {
        this.model.bankAccounts.splice(idx, 1);
      });
    }, (reason) => {
    });


  }

  addBankAccount() {
    const modalRef = this.modalService.open(BankAccountDetailComponent, {backdrop: 'static'});
    modalRef.componentInstance.branchId = this.model.id;
    modalRef.result.then((result) => {
      this.model.bankAccounts.push(result);
    }, (reason) => {
    });
  }

  addAutomaticMeterReadingAccount() {
    const modalRef = this.modalService.open(MeterReadingAccountDetailComponent, {backdrop: 'static'});
    modalRef.componentInstance.branchId = this.model.id;
    modalRef.componentInstance.buildings = this.getBuildings();
    modalRef.result.then((result) => {
      this.model.amrAccounts.push(result);
      this.getAMRAccoutsBuildings();
    }, (reason) => {
    });
  }

  updateAutomaticMeterReadingAccount(idx: number) {
    let amrAccount = this.model.amrAccounts[idx];
    if (amrAccount.id) {
      this.branchService.updateAutomaticMeterReadingAccount(amrAccount, this.model.id, amrAccount.id).subscribe();
    } else {
      this.branchService.addAutomaticMeterReadingAccount(amrAccount, this.model.id).subscribe((response) => {
        amrAccount.id = response.id;
      });
    }
    this.getAMRAccoutsBuildings();
  }

  removeAutomaticMeterReadingAccount(idx: number) {
    const modalRef = this.modalService.open(DeleteDialogComponent);
    modalRef.result.then((result) => {
      let amrAccount = this.model.amrAccounts[idx];

      this.branchService.deleteAutomaticMeterReadingAccount(this.model.id, amrAccount.id).subscribe(() => {
        this.model.amrAccounts.splice(idx, 1);
        this.getAMRAccoutsBuildings();
      });
    }, (reason) => {
    });
  }

  getBuildings() {
    let buildingIds = this.model.amrAccounts.reduce((acc, curr) => {
      return acc.concat(curr.buildingIds);
    }, []);

    return this.buildings.filter(b => !buildingIds.includes(b.id));
  }

  getAMRAccoutsBuildings() {
    let buildings = this.getBuildings();

    this.amrAccountsBuildings = this.model.amrAccounts.map(item => {
      return buildings.concat(this.buildings.filter(b => item.buildingIds.includes(b.id)));
    })
  }

  onChangeDepartment(department: DepartmentViewModel) {
    department.isSelected = !department.isSelected;

    if (department.isSelected) {
      this.branchService.addDepartment(department.id).subscribe();
    } else {
      this.branchService.removeDepartment(department.id).subscribe();
    }

  }

  getFilteredFrequency(value: number) {
    return callFrequencyArray.filter(item => item !== value);
  }
}
