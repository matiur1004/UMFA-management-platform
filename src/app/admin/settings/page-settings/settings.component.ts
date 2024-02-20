import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../shared/settings.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CategoryViewModel, ContactInformationViewModel, DepartmentViewModel, NationalTenantViewModel} from '@models';
import {ManagementCompanyViewModel} from '../shared/models/management-company.model';
import {NationalTenantsService} from '@services';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {

  nationalTenantsModel: NationalTenantViewModel[];
  model: ManagementCompanyViewModel = new ManagementCompanyViewModel();
  category: CategoryViewModel;
  categoryError: string;
  department: DepartmentViewModel;
  departmentError: string;
  clientDepartment: DepartmentViewModel;
  clientDepartmentError: string;
  private phoneContactLabels: string[];
  private externalLinkLabels: string[];

  constructor(private settingsService: SettingsService, private nationalTenantService: NationalTenantsService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.phoneContactLabels = this.settingsService.phoneContactLabels;
    this.externalLinkLabels = this.settingsService.externalLinkLabels;
    this.loadData();
  }

  loadData() {
    forkJoin([this.settingsService.getSettings(), this.nationalTenantService.getNationalTenants()]).subscribe(([settings, nationalTenants]) => {
      this.model = settings;
      this.model.phoneContacts = settings.contactInformations.filter(c => this.phoneContactLabels.includes(c.label));
      this.model.externalLinks = settings.contactInformations.filter(c => this.externalLinkLabels.includes(c.label));
      this.nationalTenantsModel = nationalTenants;
    });
  }

  updateCompany() {
    this.model.contactInformations = new Array<ContactInformationViewModel>();

    this.model.externalLinks.forEach(c => {
      this.model.contactInformations.push(c);
    });

    this.model.phoneContacts.forEach(c => {
      this.model.contactInformations.push(c);
    });

    this.settingsService.update(this.model).subscribe(model => {
      model.phoneContacts = model.contactInformations.filter(c => this.phoneContactLabels.includes(c.label));
      model.externalLinks = model.contactInformations.filter(c => this.externalLinkLabels.includes(c.label));
      this.model = model;
    }, error => {
    });
  }

  dropdownChanged(contact) {
    if (contact.value) {
      this.updateCompany();
    }
  }

  logoChanged(file) {
    this.settingsService.updateLogo(file).subscribe(() => {
      this.model.logoUrl = this.settingsService.getLogoUrl();
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

  removePhoneContact(index) {
    this.model.phoneContacts.splice(index, 1);
    this.updateCompany();

  }

  updatePhoneContact(index) {
    this.updateCompany();
  }

  removeExternalLink(index) {
    this.model.externalLinks.splice(index, 1);
    this.updateCompany();
  }

  removeDepartment(index) {
    this.settingsService.deleteDepartment(this.model.departments[index].id, false)
      .subscribe(() => this.model.departments.splice(index, 1));
  }

  removeClientDepartment(index) {
    this.settingsService.deleteDepartment(this.model.clientDepartments[index].id, true)
      .subscribe(() => this.model.clientDepartments.splice(index, 1));
  }

  removeBuildingCategory(index) {
    this.settingsService.deleteCategory(this.model.categories[index].id)
      .subscribe(() => this.model.categories.splice(index, 1));
  }

  onAddCategory() {
    this.category = new CategoryViewModel();
    this.category.name = "New Category";
    this.category.icon = '';
  }

  onCancelCategory() {
    this.categoryError = null;
    this.category = null;
  }

  onCategoryIconChanged(icon, category) {
    category.icon = icon;
    this.updateCompany();
  }

  onSaveCategory() {
    this.categoryError = null;

    if (!this.category.icon) {
      this.categoryError = "Icon is requered";
      return;
    }

    if (!this.category.name) {
      this.categoryError = "Name is requered";
      return;
    }

    let model = JSON.parse(JSON.stringify(this.model));
    model.categories.push(this.category);

    this.settingsService.update(model).subscribe(model => {
      model.phoneContacts = model.contactInformations.filter(c => this.phoneContactLabels.includes(c.label));
      model.externalLinks = model.contactInformations.filter(c => this.externalLinkLabels.includes(c.label));
      this.model = model;
    });

    this.category = null;

  }

  onCategoryIconSelected(icon) {
    this.category.icon = icon;
  }

  onAddClientDepartment() {
    this.clientDepartment = new DepartmentViewModel();
    this.clientDepartment.name = 'New Client Department';
  }

  onCancelClientDepartment() {
    this.clientDepartmentError = null;
    this.clientDepartment = null;
  }

  onSaveClientDepartment() {
    this.clientDepartmentError = null;
    if (!this.clientDepartment.name) {
      this.clientDepartmentError = "Name is requered";
      return;
    }

    let model = JSON.parse(JSON.stringify(this.model));
    model.clientDepartments.push(this.clientDepartment);
    this.settingsService.update(model).subscribe(r => {
      this.clientDepartment = null;
      r.phoneContacts = r.contactInformations.filter(c => this.phoneContactLabels.includes(c.label));
      r.externalLinks = r.contactInformations.filter(c => this.externalLinkLabels.includes(c.label));
      this.model = r;
    });
  }

  onAddDepartment() {
    this.department = new DepartmentViewModel();
    this.department.name = 'New Department';

  }

  onCancelDepartment() {
    this.departmentError = null;
    this.department = null;
  }

  onSaveDepartment() {
    this.departmentError = null;
    if (!this.department.name) {
      this.departmentError = "Name is requered";
      return;
    }

    let model = JSON.parse(JSON.stringify(this.model));
    model.departments.push(this.department);

    this.settingsService.update(model).subscribe(r => {
      this.department = null;
      r.phoneContacts = r.contactInformations.filter(c => this.phoneContactLabels.includes(c.label));
      r.externalLinks = r.contactInformations.filter(c => this.externalLinkLabels.includes(c.label));
      this.model = r;
    });

  }
}
