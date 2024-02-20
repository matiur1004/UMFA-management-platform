import {AddressViewModel} from "./address.model";
import {ContactInformationViewModel} from "./contact-infomation.model";

export class UserAccountViewModel {
  id: string;
  fullName: string;
  logo: File;
  logoUrl: string;
  phone: string;
  email: string;
  description: string;
  address: AddressViewModel = new AddressViewModel();
  departmentIds: string[] = new Array<string>();
  contactInformations: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
}
