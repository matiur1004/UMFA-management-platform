import {ContactInformationViewModel} from "./contact-infomation.model";

export class TenantViewModel {
  id: string;
  name: string;
  phone: string;
  totalGLA: number;
  email: string;
  shops: string[] = new Array<string>();
  buildingId: string;
  nationalTenantId: string;

  contactInformations: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
  contactExternalLinks: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
  contactPhoneNumbers: ContactInformationViewModel[] = new Array<ContactInformationViewModel>();
}
