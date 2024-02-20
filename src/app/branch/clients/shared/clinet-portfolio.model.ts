import {BuildingViewModel} from "./building.model";

export class ClinetPortfolioViewModel {
  id: string;
  name: string;
  logo: File;
  isSelected: boolean;
  logoUrl: string;
  totalBuildings: number;

  buildings: BuildingViewModel[];
}
