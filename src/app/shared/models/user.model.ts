import {AddressViewModel} from './address.model';
import {ContactInformationViewModel} from './contact-infomation.model';
import {DepartmentViewModel} from './department.model';

export class UserViewModel {
  id: string;
  fullName: string;
  email: string;
}

export class UserProfileUserViewModel {
  id: string;
  fullName: string;
  email: string;
  rolesDescription: string;
  phone: string;
  description: string;
  password: string;
  logo: File;
  address: AddressViewModel = new AddressViewModel();
  contactInformations: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
  contactExternalLinks: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
  contactPhoneNumbers: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
  departments: DepartmentViewModel[] = new Array<DepartmentViewModel>();
  logoUrl: string;
  departmentDescription: string;
  isAssigned: boolean;
  roles: string[] = new Array<string>();
  descriptionRoles: any[] = new Array<any>();
}
