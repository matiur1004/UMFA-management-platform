import {AddressViewModel} from "./address.model";
import {ContactInformationViewModel} from "./contact-infomation.model";
import {DepartmentViewModel} from "./department.model";


export class ContactViewModel {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  description: string;
  logo: File;
  address: AddressViewModel = new AddressViewModel();
  contactInformations: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
  contactExternalLinks: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
  contactPhoneNumbers: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
  departments: DepartmentViewModel[] = new Array<DepartmentViewModel>();
  logoUrl: string;
  departmentDescription: string;
}
