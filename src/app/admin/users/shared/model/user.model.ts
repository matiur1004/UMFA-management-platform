import {AddressHomeViewModel, ContactInformationViewModel, DepartmentViewModel} from '@models';
import {BranchViewModel} from './branch.model';
import {RoleDetailViewModel} from './role.model';

export class UserViewModel {
  id: string;
  fullName: string;
  email: string;
  isApproved: boolean;
  lastLogin: Date;
  departmentDescription: string;
  logoUrl: string;
  branches: string[];
  departments: string[];
  contactInformations: ContactInformationViewModel[];
  role: string;
}

export class UserDetailViewModel {
  id: string;
  fullName: string;
  email: string;
  isApproved: boolean;
  description: string;
  phone: string;
  logoUrl: string;
  role: RoleDetailViewModel;
  logo: File;
  address: AddressHomeViewModel = new AddressHomeViewModel();
  branches: BranchViewModel[] = new Array<BranchViewModel>();
  departments: DepartmentViewModel[] = new Array<DepartmentViewModel>();
  contactInformations: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
}

export class UserWriteViewModel {
  id: string;
  fullName: string;
  email: string;
  isApproved: boolean;
  description: string;
  phone: string;
  logoUrl: string;
  roleId: string;
  logo: File;
  address: AddressHomeViewModel = new AddressHomeViewModel();
  branches: string[] = new Array<string>();
  departments: string[] = new Array<string>();
  contactInformations: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
}
