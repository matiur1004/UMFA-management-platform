import {NodeType} from './node.model';
import {SupplyType, TariffCategoryViewModel} from '@models';

export interface ReplaceMeterNodeViewModel {
  id: string;
  name: string;
  totalAmperage: number;
  nodeType: NodeType;
  supplyType: SupplyType;
  tariff: NodeTariffViewModel;
}

export interface NodeTariffViewModel {
  id: string;
  name: string;
  isBilling: boolean;
  lineItems: NodeTariffLineItemViewModel[];
}

export interface NodeTariffLineItemViewModel {
  id: string;
  name: string;
  isActive: boolean;
  isBilling: boolean;
  categoryId: string;
  categoryName: string;
  categories: TariffCategoryViewModel[];
}
