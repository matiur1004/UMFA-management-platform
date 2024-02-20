import {BuildingViewModel} from "./building-view.model";

export class ClientViewModel {
  id: string;
  name: string;
  isSelected: boolean;
  isDetailed: boolean;
  logoUrl: string;
  portfolios: ClientPortfolioViewModel[] = new Array<ClientPortfolioViewModel>();
  portfoliosLength: number;
  buildingsLength: number;
  searchedPortfolios: ClientPortfolioViewModel[];
  isSelectedPartly: boolean;
}

export class ClientPortfolioViewModel {
  id: string;
  name: string;
  isSelected: boolean;
  isDetailed: boolean;
  logoUrl: string;
  buildings: BuildingViewModel[];
  buildingsLength: number;
  searchedBuildings: BuildingViewModel[];
  isSelectedPartly: boolean;
}
