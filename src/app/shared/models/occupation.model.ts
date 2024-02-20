import {CommonAreaViewModel} from "./common-area.model";
import {ShopViewModel} from "./shop.model";
import {CommonAreaLiabilityViewModel} from "./common-area-liability.model";
import {LocationViewModel} from './location.model';
import {BuildingPeriodViewModel} from "app/branch/buildings/manage-building/shared/models/building-period.model";

export class OccupationViewModel {
  buildingId: string;
  buildingPeriod: BuildingPeriodViewModel;
  shops = new Array<ShopViewModel>();
  commonAreas = new Array<CommonAreaViewModel>();
  commonAreaLiabilities = new Array<CommonAreaLiabilityViewModel>();
  locations = new Array<LocationViewModel>();
}
