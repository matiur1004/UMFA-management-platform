import {CommonAreaViewModel} from "./common-area.model";
import {LiabilityViewModel} from "./liability.model";

export class CommonAreaLiabilityViewModel {
  commonAreaId: string;
  commonArea: CommonAreaViewModel;
  totalShopArea: string;
  liabilities: LiabilityViewModel[] = new Array<LiabilityViewModel>();
  shopCount: number = 0;
}
