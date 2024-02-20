import {AddressPhysicalViewModel} from './address.physical.model';
import {AddressPostalViewModel} from './address.postal.model';
import {BankAccountViewModel} from './bankAccount.model';
import {ContactInformationViewModel} from './contact-infomation.model';
import {ShareholderViewModel} from './shareholder.model';
import {AutomaticMeterReadingAccountViewModel} from './automaticMeterReadingAccount.model';

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

export class BranchModel {
  id: string;
  name: string;
  physicalAddress: AddressPhysicalViewModel;
  isSelected: boolean = false;
}
