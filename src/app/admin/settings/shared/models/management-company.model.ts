import {CategoryViewModel, ContactInformationViewModel, DepartmentViewModel, NationalTenantViewModel} from "@models";

export class ManagementCompanyViewModel {
  id: string;
  registrationName: string;
  registrationNumber: string;
  vatNumber: string;
  email: string;
  phone: string;
  logo: File;
  logoUrl: string;
  contactInformations: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
  phoneContacts: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
  externalLinks: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
  categories: CategoryViewModel[] = new Array<CategoryViewModel>();
  clientDepartments: DepartmentViewModel[] = new Array<DepartmentViewModel>();
  departments: DepartmentViewModel[] = new Array<DepartmentViewModel>();
  nationalTenants: NationalTenantViewModel[] = new Array<NationalTenantViewModel>();
}
