import {MeterTypeViewModel} from './meter-type.model';
import {ClientPortfolioViewModel, ClientViewModel} from './client.model';
import {AddressPhysicalViewModel} from './address.physical.model';
import {CategoryViewModel} from './category.model';
import { BuildingStatus } from './building-status.model';

export class BuildingViewModel {
  id: string;
  name: string;
  status: BuildingStatus;
  totalGLA: number;
  totalGla?: number;
  category: string;
  client: ClientViewModel;
  clientPortfolio: ClientPortfolioViewModel;
  address: AddressPhysicalViewModel;
  addressDetails?: string;
  categoryDescription?: string;
  categories: CategoryViewModel[];
  logoUrl: string;
  isSelected?: boolean;
  isDetailed?: boolean;
}

export class BuildingDetailViewModel {
  id: string;
  name: string;
  status: BuildingStatus = 0;
  area: number;
  categoryIds: string[] = new Array<string>();
  clientId: string;
  clientPortfolioId: string;
  address: AddressPhysicalViewModel = new AddressPhysicalViewModel();
  logo: File;
  logoUrl: string;
  isActiveForReading: boolean;
  numberOfTenants: number = 0;
  numberOfShops: number = 0;
  numberOfMeterTypes: MeterTypeViewModel[] = new Array<MeterTypeViewModel>();
  numberOfSqMetres: number = 0;
  numberOfCouncilAcc: number = 0;
  numberOfHours: number = 0;
  numberOfMeters: number = 0;

}
