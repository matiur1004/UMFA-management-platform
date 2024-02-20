import {NodeDetailViewModel} from "../../shared/models";
import {
  EquipmentAttributeViewModel,
  EquipmentTreeShopModel,
  SupplyToViewModel,
  TariffViewModel,
  VersionViewModel
} from "@models";

export interface DialogSelectNodesInputDataModel {
  buildingId: string;
  versionId: string;
  supplyType: number;
  excludeNodesIds: string[];
  nodes: NodeDetailViewModel[];
  shops: EquipmentTreeShopModel[];
  areas: any[];
  tariffs: VersionViewModel<TariffViewModel>[];
  attributes: EquipmentAttributeViewModel[];
  supplies: SupplyToViewModel[]
}
