import {SupplyType} from './supply-type.model';
import { AddressPhysicalViewModel, AddressPostalViewModel} from '@models';

export interface SupplierViewModel {
  id: string;
  name: string;
  logoUrl?: string;
  description: string;
  email: string;
  phone: string;
  registrationNumber: string;
  vatNumber: string;
  webAddress: string;
  supplyTypes: SupplyType[];
  physicalAddress: AddressPhysicalViewModel;
  postalAddress: AddressPostalViewModel;
}
