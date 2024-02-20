import { AddressPhysicalViewModel, AddressPostalViewModel, UploadResponseViewModel} from '@models';

export class OperationsAgreementViewModel {
  buildingId: string;
  branch: BranchViewModel;
  building: BuildingViewModel;
  paymentPlan: PaymentPlanViewModel = new PaymentPlanViewModel();
  recoveries: RecoveriesViewModel = new RecoveriesViewModel();
  deposits: DepositsViewModel = new DepositsViewModel();
  generalInformation: GeneralInformationViewModel = new GeneralInformationViewModel();
  meteringInformation: MeteringInformationViewModel = new MeteringInformationViewModel();
  contacts = new Array<OperationsAgreementContactViewModel>();
  files = new Array<ItemDocumentViewModel>();
  isComplete: boolean;
  commentRequired: boolean;
  comment: string;
}

export class BranchViewModel {
  id: string;
  name: string;
}

export class BuildingViewModel {
  id: string;
  name: string;
  owner: string;
  physicalAddress: AddressPhysicalViewModel;
  postalAddress: AddressPostalViewModel;
}

export class PaymentPlanViewModel {
  shareLoss: PaymentPlanItemViewModel = new PaymentPlanItemViewModel();
  minRecovery: PaymentPlanItemViewModel = new PaymentPlanItemViewModel();
  minMonthlyFee: PaymentPlanItemViewModel = new PaymentPlanItemViewModel();
  maxMonthlyFee: PaymentPlanItemViewModel = new PaymentPlanItemViewModel();
  minNettoRecovery: PaymentPlanItemViewModel = new PaymentPlanItemViewModel();
}

export class PaymentPlanItemViewModel {
  active: boolean;
  amount: number;
}

export class RecoveriesViewModel {
  electrycity: RelationshipSubject;
  water: RelationshipSubject;
  sewerage: RelationshipSubject;
  gas: RelationshipSubject;
}

export class DepositsViewModel {
  carryElectrycity: DepositsItemViewModel = new DepositsItemViewModel();
  carryWater: DepositsItemViewModel = new DepositsItemViewModel();
  carrySewerage: DepositsItemViewModel = new DepositsItemViewModel();
  chargeDeposits: DepositsItemViewModel = new DepositsItemViewModel();
}

export class DepositsItemViewModel {
  subject: RelationshipSubject;
  amount: number;
}

export class GeneralInformationViewModel {
  appontmentReceived: boolean;
  municipalAccountReceived: boolean;
  firstInvoice: Date;
  arrangementForKeys: string;
  previousCompany: string;
  previousContact: string;
  previousCompanyLastReadingDate: Date;
  finalReading: boolean;
}

export class MeteringInformationViewModel {
  tenatList: boolean;
  shopNumbers: boolean;
  squareMeters: boolean;
  tenantLeaseAgreements: boolean;
  finalReadings: boolean;
  tenantsLetter: boolean;
  buildingPlan: boolean;
  electricalDiagram: boolean;
  meterReplacementContract: boolean;
  meterInstations: boolean;
}

export class ItemDocumentViewModel {
  id: string;
  fileName: string;
  fileSize: string;
  field: FieldType;
  contentType: string;
  uploadTask: any;
  status: UploadResponseViewModel = new UploadResponseViewModel();
}

export class OperationsAgreementContactViewModel {
  id: string;
  departmentId: string;
  userId: string;
  contactId: string;
  position: ContactPosition;
}

export enum RelationshipSubject {
  owner = 0,
  umfa,
  tenants
}

export enum ContactPosition {
  BranchTechnical = 0,
  BranchFinancial = 2,
  BranchManager = 4,
  TenantMovementsInfo = 6,
  BranchAdministrator = 7,
  BranchPortfolioManager = 8,
  ClientOpsQuestions = 9,
  ClientSendImportFiles = 10,
  ClientMonthlyReports = 11,
  ClientSendInvoicing = 12
}

export enum FieldType {
  appontmentLetter,
  municipalAccount,
  tenantList,
  shopNumbers,
  squareMeters,
  tenantLeaseAgreement,
  finalReading,
  tenantsLetter,
  buildingPlan,
  electricalDiagram,
  meterReplacementContract,
  meterInstations
}


export class ItemDocumentListViewModel {
  totalProgresDone: number = 0;
  documents: ItemDocumentViewModel[] = new Array<ItemDocumentViewModel>();
}
