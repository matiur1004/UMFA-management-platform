import {TariffCategoryViewModel, TariffLineItemChargingType, TariffViewModel, VersionViewModel} from '@models';

export class GroupedTariffViewModel {
  versions: VersionViewModel<TariffViewModel>[] = new Array<VersionViewModel<TariffViewModel>>();
}

export class AllocatedTariffDetailViewModel {
  id: string;
  name: string;
  code: string;
  supplierName: string;
  versionDate: Date;
  majorVersion: number;
  isBilling: boolean;
  lineItems: AllocatedTariffLineItemViewModel[] = new Array<AllocatedTariffLineItemViewModel>();
  nodeId?: string;
  approvalInfo: ApprovalInfoViewModel;
  duplicationFactor: number;
  hasConflicts?: boolean;
}

export class AllocatedTariffLineItemViewModel {
  id: string;
  name: string;
  chargingType: TariffLineItemChargingType;
  chargingMethod: string;
  unitName: string;
  attributeName: string;
  isActive: boolean;
  isBilling: boolean;
  categoryId: string;
  categories: TariffCategoryViewModel[] = new Array<TariffCategoryViewModel>();
  hasDuplicationFactor: boolean;
  approvalInfo: ApprovalInfoViewModel;
  hasConflicts?: boolean;
}

export class ApprovalInfoViewModel {
  comment: string;
  fileLocalPath: string;
  userId: string;
  date: Date;
  userName: string;
  file: string;
}
