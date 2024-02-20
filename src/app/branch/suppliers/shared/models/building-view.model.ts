import { AddressPhysicalViewModel, AddressPostalViewModel} from '@models';

export class BuildingViewModel {
  id: string;
  name: string;
  owner: string;
  physicalAddress: AddressPhysicalViewModel;
  postalAddress: AddressPostalViewModel;
}
