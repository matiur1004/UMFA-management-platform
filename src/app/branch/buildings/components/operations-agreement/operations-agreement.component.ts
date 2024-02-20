import {ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {
  AddressViewModel,
  BranchModel,
  BuildingDetailViewModel,
  ContactViewModel,
  DepartmentViewModel,
  NewFileViewModel,
  UploadResponseViewModel,
  VersionActionType,
  VersionResultViewModel,
  VersionViewModel
} from '@models';
import {OperationsAgreementService} from '../../shared/operations-agreement.service';
import {forkJoin, Subject} from 'rxjs';
import {
  ContactPosition,
  FieldType,
  ItemDocumentListViewModel,
  ItemDocumentViewModel,
  OperationsAgreementContactViewModel,
  OperationsAgreementViewModel,
  RelationshipSubject
} from '../../models/operations-agreement.model';
import {UserContactViewModel} from '../../models/user-contact.model';
import {ClientViewModel} from 'app/branch/clients/shared/client.model';
import {ActivatedRoute, Router} from '@angular/router';
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter,
  NgbDropdown,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {CreateBranchContactComponent} from 'app/branch/create-branch-contact/create-branch-contact.component';
import {CreateClientContactComponent} from 'app/branch/create-client-contact/create-client-contact.component';
import {FileExtension} from '../../../../shared/helper/file-extension';
import {BranchManagerService, BranchSettingsService, BuildingService, NotificationService} from '@services';
import {ClientService} from '../../../clients/shared/client.service';
import {NgbDateFRParserFormatter} from '@shared-helpers';

@Component({
  selector: 'operations-agreement',
  templateUrl: './operations-agreement.component.html',
  styleUrls: ['./operations-agreement.component.less'],
  providers: [OperationsAgreementService,
    {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter},
    {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}],
})
export class OperationsAgreementComponent implements OnInit {

  @Input() buildingId: string;
  @Input() versionId: string;

  @Input() client: ClientViewModel;

  @ViewChildren(NgbDropdown) upldPopup: QueryList<NgbDropdown>;

  FieldType = FieldType;
  branch: BranchModel;
  building: BuildingDetailViewModel = new BuildingDetailViewModel();
  model: OperationsAgreementViewModel = new OperationsAgreementViewModel();
  branchDepartments = new Array<DepartmentViewModel>();
  clientDepartments = new Array<DepartmentViewModel>();
  branchTechnicalContacts = new Array<OperationsAgreementContactViewModel>();
  branchAdminContacts = new Array<OperationsAgreementContactViewModel>();
  branchPortfolioManagerContacts = new Array<OperationsAgreementContactViewModel>();
  branchFinancialContacts = new Array<OperationsAgreementContactViewModel>();
  branchManagerContacts = new Array<OperationsAgreementContactViewModel>();
  clientOpsQuestionsContacts = new Array<OperationsAgreementContactViewModel>();
  tenantMovementsInfoContacts = new Array<OperationsAgreementContactViewModel>();
  clientSendImportFilesContacts = new Array<OperationsAgreementContactViewModel>();
  clientMonthlyReportsContacts = new Array<OperationsAgreementContactViewModel>();
  clientSendInvoicingContacts = new Array<OperationsAgreementContactViewModel>();
  branchUsersContacts = new Array<UserContactViewModel>();
  clientContacts = new Array<UserContactViewModel>();
  submitNotify = new Subject<any>();
  isValid = true;
  isNew = false;
  RelationshipSubject = RelationshipSubject;
  isSubmited = false;
  baseVersionId: string;
  branchAddresses: Array<AddressViewModel> = [];
  validationMessages = {
    paymentPlan: 'Payment plan amount is empty or not valid'
  };
  contactPosition = ContactPosition;
  documentList: Array<ItemDocumentListViewModel> = new Array<ItemDocumentListViewModel>()
  private readonly FILE_FIELD_COUNT: number = Object.keys(FieldType).length / 2;

  constructor(private operationsAgreementService: OperationsAgreementService, private activatedRoute: ActivatedRoute,
              private ref: ChangeDetectorRef, private modalService: NgbModal, private notificationService: NotificationService,
              private clientService: ClientService, private buildingService: BuildingService, private branchService: BranchSettingsService,
              private branchManagerService: BranchManagerService, private router: Router) {
  }

  ngOnInit() {
    this.branch = this.branchManagerService.getCurrentBranch();
    this.loadData();
  }

  loadData() {
    this.initDocumentList();

    const operationsAgreement = this.operationsAgreementService.get(this.buildingId, this.versionId);
    const branchDepartments = this.operationsAgreementService.getBranchDepartments();
    const clientDepartments = this.operationsAgreementService.getClientDepartments(this.client.id);
    const client = this.clientService.getById(this.client.id);
    const building = this.buildingService.get(this.buildingId);
    const currentBranch = this.branchService.get(this.branch.id);

    const join = forkJoin(operationsAgreement, branchDepartments, clientDepartments, client, building, currentBranch);
    join.subscribe(result => {

      this.parseDateValues(result[0].entity);

      this.model = result[0].entity;
      this.baseVersionId = result[0].current.id;
      this.model.isComplete = result[0].entity.isComplete;

      this.branchDepartments = result[1];
      this.clientDepartments = result[2];

      this.client = result[3];
      this.building = result[4];

      this.branchAddresses.push(result[5].physicalAddress);
      this.branchAddresses.push(result[5].postAddress);

      this.mapFileToDocument(this.model.files);
      this.setContactArrays();

      this.operationsAgreementService.getBranchContacts().subscribe(response => {
        this.branchUsersContacts = response;
      });

      this.operationsAgreementService.getClientContacts(this.client.id).subscribe(response => {
        this.clientContacts = response;
      });
    });
  }

  setContactArrays() {
    this.branchTechnicalContacts = this.model.contacts.filter(c => c.position === ContactPosition.BranchTechnical);
    this.branchAdminContacts = this.model.contacts.filter(c => c.position === ContactPosition.BranchAdministrator);
    this.branchPortfolioManagerContacts = this.model.contacts.filter(c => c.position === ContactPosition.BranchPortfolioManager);
    this.branchFinancialContacts = this.model.contacts.filter(c => c.position === ContactPosition.BranchFinancial);
    this.branchManagerContacts = this.model.contacts.filter(c => c.position === ContactPosition.BranchManager);

    this.clientOpsQuestionsContacts = this.model.contacts.filter(c => c.position === ContactPosition.ClientOpsQuestions);
    this.tenantMovementsInfoContacts = this.model.contacts.filter(c => c.position === ContactPosition.TenantMovementsInfo);
    this.clientSendImportFilesContacts = this.model.contacts.filter(c => c.position === ContactPosition.ClientSendImportFiles);
    this.clientMonthlyReportsContacts = this.model.contacts.filter(c => c.position === ContactPosition.ClientMonthlyReports);
    this.clientSendInvoicingContacts = this.model.contacts.filter(c => c.position === ContactPosition.ClientSendInvoicing);
  }

  setDefaultContact(contacts: OperationsAgreementContactViewModel[], position: ContactPosition) {
    if (!contacts.length) {
      let contact = new OperationsAgreementContactViewModel();
      contact.position = position;
      contacts.push(contact);
    }
  }

  addContact(contacts: Array<OperationsAgreementContactViewModel>, position: ContactPosition) {
    const contact = new OperationsAgreementContactViewModel();
    contact.position = position;
    contacts.push(contact);
  }

  removeContact(contacts, index: number) {
    contacts.splice(index, 1);
  }

  contactChange(index, contacts, contact) {
    contacts.splice(index, 1, contact);
  }

  validate() {
    let invalidItems = 0;

    this.isValid = !invalidItems;

    if (this.isValid && this.model.paymentPlan.shareLoss.active) {
      this.isValid = this.isNumberValid(this.model.paymentPlan.shareLoss.amount);
    }

    if (this.isValid && this.model.paymentPlan.minRecovery.active) {
      this.isValid = this.isNumberValid(this.model.paymentPlan.minRecovery.amount);
    }

    if (this.isValid && this.model.paymentPlan.minMonthlyFee.active) {
      this.isValid = this.isNumberValid(this.model.paymentPlan.minMonthlyFee.amount);
    }

    if (this.isValid && this.model.paymentPlan.maxMonthlyFee.active) {
      this.isValid = this.isNumberValid(this.model.paymentPlan.maxMonthlyFee.amount);
    }

    if (this.isValid && this.model.paymentPlan.minNettoRecovery.active) {
      this.isValid = this.isNumberValid(this.model.paymentPlan.minNettoRecovery.amount);
    }
  }

  save(isComplete) {
    if (isComplete) {
      this.setDefaultContact(this.branchTechnicalContacts, ContactPosition.BranchTechnical);
      this.setDefaultContact(this.branchAdminContacts, ContactPosition.BranchAdministrator);
      this.setDefaultContact(this.branchPortfolioManagerContacts, ContactPosition.BranchPortfolioManager);
      this.setDefaultContact(this.branchFinancialContacts, ContactPosition.BranchFinancial);
      this.setDefaultContact(this.branchManagerContacts, ContactPosition.BranchManager);
      this.setDefaultContact(this.clientOpsQuestionsContacts, ContactPosition.ClientOpsQuestions);
      this.setDefaultContact(this.tenantMovementsInfoContacts, ContactPosition.TenantMovementsInfo);
      this.setDefaultContact(this.clientSendImportFilesContacts, ContactPosition.ClientSendImportFiles);
      this.setDefaultContact(this.clientMonthlyReportsContacts, ContactPosition.ClientMonthlyReports);
      this.setDefaultContact(this.clientSendInvoicingContacts, ContactPosition.ClientSendInvoicing);
      this.ref.detectChanges();
    }

    if (isComplete) {
      this.isSubmited = true;
      this.submitNotify.next();
      this.validate();
    }

    if (this.isValid || !isComplete) {
      this.model.contacts = this.branchTechnicalContacts.concat(
        this.branchFinancialContacts.filter(c => c.departmentId),
        this.branchAdminContacts.filter(c => c.departmentId),
        this.branchPortfolioManagerContacts.filter(c => c.departmentId),
        this.branchManagerContacts.filter(c => c.departmentId),
        this.clientOpsQuestionsContacts.filter(c => c.departmentId),
        this.tenantMovementsInfoContacts.filter(c => c.departmentId),
        this.clientSendImportFilesContacts.filter(c => c.departmentId),
        this.clientMonthlyReportsContacts.filter(c => c.departmentId),
        this.clientSendInvoicingContacts.filter(c => c.departmentId)
      );

      let action = this.getActionType(isComplete);

      let versionModel = new VersionViewModel(this.model, '', action, null, this.baseVersionId);

      this.operationsAgreementService.update(this.buildingId, versionModel).subscribe((response: VersionResultViewModel) => {
        this.parseDateValues(response.entity);
        this.baseVersionId = response.current.id;
        this.model.isComplete = response.entity.isComplete;
        this.model = response.entity;
        this.setContactArrays();
      });
    }
  }

  onCancel() {
    this.onNavigate();
  }

  getActionType(isComplete): VersionActionType {
    if (isComplete) {
      return VersionActionType.Insert;
    } else {
      return this.model.isComplete ? VersionActionType.Insert : VersionActionType.Init;
    }
  }

  onFileChangeEmiter($event) {
    this.onFileChange($event.event, $event.field);
  }

  onFileChange($event, field) {
    let files: File[] = $event.srcElement.files;

    if (files && files.length > 0) {
      let documentList = this.documentList[field];

      if (documentList.documents.length == 0) {
        let popupIdx = field >= 2 ? field + 1 : field;
        let popups = this.upldPopup.toArray();
        let popup = popups[popupIdx];
        popup.open();
      }

      Array.from(files).forEach(file => {
        if (file.size > 10000000) {
          this.notificationService.error("File '{0}' cannot be more 10MB".replace('{0}', file.name));
          return;
        }
        let newDocumentItem = new ItemDocumentViewModel();
        newDocumentItem.uploadTask = this.startUploadFile(file, newDocumentItem, field);
        newDocumentItem.fileName = file.name;
        newDocumentItem.fileSize = FileExtension.bytesToSize(file.size);
        newDocumentItem.field = field;
        newDocumentItem.contentType = file.type;
        documentList.documents.push(newDocumentItem);
      });
    }
  }

  startUploadFile(file: File, document: ItemDocumentViewModel, field: number) {
    let newFile = new NewFileViewModel();
    newFile.file = file;

    let uploadTask = this.operationsAgreementService.uploadOAFile(this.buildingId, field, newFile)
      .subscribe(
        (status: UploadResponseViewModel) => {
          if (status == null)
            return;

          document.status = status;
          document.id = status.data;
          this.updateProgressesStatus(field);

        },
        r => {
          document.status.hasError = true;
          this.removeFileFromArray(document);
        }
      );

    return uploadTask;
  }

  updateProgressesStatus(field: number) {

    let documentList = this.documentList[field];

    let items = documentList.documents.filter(i => !i.status.isCompleted && !i.status.hasError).map(v => v.status.progressDone);
    if (items.length)
      documentList.totalProgresDone = Math.round(items.reduce(function (a, b) {
        return a + b;
      }) / items.length);
    else
      documentList.totalProgresDone = 0;
  }

  mapFileToDocument(files: any[]) {

    if (!files.length)
      return;

    for (var i = 0; i < this.FILE_FIELD_COUNT; i++) {
      let documentList = this.documentList[i];
      documentList.documents = files.filter(f => f.field === i).map(file => {
        let document = new ItemDocumentViewModel();
        document.id = file.id;
        document.field = file.field;
        document.contentType = file.contentType;
        document.fileName = file.fileName;
        document.fileSize = FileExtension.bytesToSize(file.fileSize);
        document.status.isCompleted = true;

        return document;
      });
    }

  }

  initDocumentList() {
    for (var i = 0; i < this.FILE_FIELD_COUNT; i++) {
      this.documentList.push(new ItemDocumentListViewModel());
    }
  }

  createNewBranchContact(contacts: Array<OperationsAgreementContactViewModel>, position: ContactPosition) {

    const modalRef = this.modalService.open(CreateBranchContactComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = new ContactViewModel();
    modalRef.componentInstance.isNew = true;
    modalRef.componentInstance.initAddresses(this.branchAddresses);

    modalRef.result.then((response: ContactViewModel) => {
      if (response) {
        this.operationsAgreementService.getBranchContacts().subscribe(branchContacts => {
          this.branchUsersContacts = branchContacts;

          const contact = new OperationsAgreementContactViewModel();
          contact.position = position;
          contact.contactId = response.id;
          contact.departmentId = response.departments[0].id;

          contacts.push(contact);
          this.ref.detectChanges();
        });
      }
    }, () => {
    });
  }

  createNewClientContact(contacts: Array<OperationsAgreementContactViewModel>, position: ContactPosition) {

    const modalRef = this.modalService.open(CreateClientContactComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = new ContactViewModel();
    modalRef.componentInstance.isNew = true;
    modalRef.componentInstance.clientId = this.client.id;
    modalRef.componentInstance.initAddresses(this.client.addresses);

    modalRef.result.then((response: ContactViewModel) => {
      if (response) {
        this.operationsAgreementService.getClientContacts(this.client.id).subscribe(clientContacts => {
          this.clientContacts = clientContacts;

          const contact = new OperationsAgreementContactViewModel();
          contact.position = position;
          contact.contactId = response.id;
          contact.departmentId = response.departments[0].id;

          contacts.push(contact);
          this.ref.detectChanges();
        });
      }
    }, () => {
    });
  }

  closePopup($event) {
    for (let popup of this.upldPopup.toArray()) {
      if (popup.isOpen()) {
        popup.close();
      }
    }
  }

  onDeleteFile(file) {
    if (file.status.isCompleted) {
      this.operationsAgreementService.deleteOAFile(this.buildingId, file.id).subscribe(r => {
        this.removeFileFromArray(file);
      });
    } else {
      this.removeFileFromArray(file);
    }
  }

  removeFileFromArray(file) {

    if (!file.status.hasError && file.uploadTask)
      file.uploadTask.unsubscribe();

    let documents = this.documentList[file.field];
    let idx = documents.documents.indexOf(file);
    if (idx !== -1)
      documents.documents.splice(idx, 1);

    this.updateProgressesStatus(file.field);
  }

  tryParseDateValue(value) {
    if (value && typeof value === "string" && Date.parse(value)) {
      return new Date(value);
    }
    return value;
  }

  parseDateValues(model: OperationsAgreementViewModel) {
    model.generalInformation.firstInvoice =
      this.tryParseDateValue(model.generalInformation.firstInvoice);

    model.generalInformation.previousCompanyLastReadingDate =
      this.tryParseDateValue(model.generalInformation.previousCompanyLastReadingDate);
  }

  isNumberValid(value) {
    const int = parseInt(value);
    if (isNaN(int)) {
      return false;
    }
    return true;
  }

  getAddressLine(address): string {
    if (!address)
      return '';

    let addressLine = '';

    if (address.line1) addressLine += address.line1 + ', ';
    if (address.line2) addressLine += address.line2 + ', ';
    if (address.suburb) addressLine += address.suburb + ', ';
    if (address.city) addressLine += address.city + ', ';
    if (address.code) addressLine += address.code + ', ';
    if (address.province) addressLine += address.province + ', ';
    if (address.country) addressLine += address.country + ', ';

    return addressLine.substring(0, addressLine.length - 2);
  }

  onNavigate() {
    const {id} = this.branch;
    if (this.router.url.includes('buildings')) {
      this.router.navigate([`/branch/${id}/buildings`]);
    } else {
      this.router.navigate([`/branch/${id}/marketing`]);
    }
  }
}
