import {AddressPhysicalViewModel, AddressPostalViewModel, BankAccountViewModel, ContactInformationViewModel, ShareholderViewModel} from '@models';
import {AutomaticMeterReadingAccountViewModel} from '../../../shared/models/automaticMeterReadingAccount.model';

export class BranchViewModel {
  id: string;
  name: string;
  registeredName: string;
  registeredNumber: string;
  vatNumber: string;
  email: string;
  webAddress: string;
  postAddress: AddressPostalViewModel = new AddressPostalViewModel();
  physicalAddress: AddressPhysicalViewModel = new AddressPhysicalViewModel();
  phone: string;
  bankAccounts: BankAccountViewModel[] = new Array<BankAccountViewModel>();
  contactInformations: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
  phoneContacts: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
  externalLinks: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
  isDetailed: boolean;
  logo: File;
  logoUrl: string;
  admins: BranchUserViewModel[] = new Array<BranchUserViewModel>();
  shareholders: ShareholderViewModel[] = new Array<ShareholderViewModel>();
  amrAccounts: AutomaticMeterReadingAccountViewModel[] = new Array<AutomaticMeterReadingAccountViewModel>();
}

export class BranchUserViewModel {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  logo: File;
  logoUrl: string;
  showAbbreviation: boolean;
}
