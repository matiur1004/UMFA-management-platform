import {AddressViewModel} from "./address.model";

export class BuildingModel {
  id: string;
  name: string;
  address: AddressViewModel;
  isSelected: boolean = false;
  isOccupationComplete: boolean;
  isOperationsAgreementComplete: boolean;

}
