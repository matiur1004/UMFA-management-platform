import {ClinetPortfolioViewModel} from "./clinet-portfolio.model";
import {AddressViewModel, ContactInformationViewModel, ContactViewModel} from "@models";

export class ClientViewModel {
  id: string;
  name: string;
  logoUrl: string;
  isSelected: boolean;
  addressDescription: string;
  phone: string;
  totalGLA: number;
  totalProfiles: number;
  totalBuildings: number;
  logo: File;
  registrationNumber: string;
  email: string;
  vatNumber: string;

  addresses: AddressViewModel[] = new Array<AddressViewModel>();
  portfolios: ClinetPortfolioViewModel[] = new Array<ClinetPortfolioViewModel>();
  contacts: ContactViewModel[] = new Array<ContactViewModel>();
  bankAccounts: any[];
  contactInformations: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
}


