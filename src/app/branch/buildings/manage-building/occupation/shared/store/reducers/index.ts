import {ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';

import * as fromOccupation from './occupation.store';

import {ShopHelper} from '../../helpers/shop.helper';
import {RelationshipDataCalculation} from '../../input-relationship-calc';
import {CommonAreaServiceLiabilityViewModel} from '../../models/common-area-service-liability.model';
import {
  CommonAreaOrder,
  CommonAreaViewModel,
  ComplexLiabilityShopFilter,
  LiabilityViewModel,
  LiableShopStatus,
  ShopFilter,
  ShopLiabilityViewModel,
  ShopOrder,
  ShopStatus,
  ShopStatusFilter,
  ShopViewModel,
  SupplyType
} from '@models';

import * as fromFloorPlans from './floor-plans.reducer';
import * as fromBuildingStepWizard from './occupation.reducer';
import * as fromEquipmentTemplate
  from '../../../../building-equipment/shared/store/reducers/building-equip-template.store';

export interface State {
  occupation: fromOccupation.State;
  floorPlans: fromFloorPlans.State;
  buildingStepWizard: fromBuildingStepWizard.State;
  equipmentTemplate: fromEquipmentTemplate.State;
}

export const reducers: ActionReducerMap<State> = {
  occupation: fromOccupation.reducer,
  floorPlans: fromFloorPlans.reducer,
  buildingStepWizard: fromBuildingStepWizard.reducer,
  equipmentTemplate: fromEquipmentTemplate.reducer
};

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = [logger];

const _getOccupationState = createFeatureSelector<State>('occupation');

// #region Common Data Selectors

export const getBuildingPeriod = createSelector(
  _getOccupationState,
  state => state.occupation.buildingPeriod
);

// #endregion

// #region Occupation Selectors

export const getOccupationState = createSelector(
  _getOccupationState,
  (state: State) => state.occupation
);

export const getTenants = createSelector(
  getOccupationState,
  fromOccupation.getTenants
);

const _getShops = createSelector(
  getOccupationState,
  fromOccupation.getShops
);

const _getCommonAreas = createSelector(
  getOccupationState,
  fromOccupation.getCommonAreas
);

export const getShopOrderIndex = createSelector(
  getOccupationState,
  fromOccupation.getShopOrderIndex
);

export const getCommonAreaOrderIndex = createSelector(
  getOccupationState,
  fromOccupation.getCommonAreaOrderIndex
);

export const getShopIds = createSelector(
  getOccupationState,
  fromOccupation.getShopIds
);

export const getCommonAreaIds = createSelector(
  getOccupationState,
  fromOccupation.getCommonAreaIds,
);

export const getShops = createSelector(
  getShopIds,
  _getShops,
  (shopIds, shops) => shopIds.map(id => shops[id])
);

export const getCommonAreas = createSelector(
  getCommonAreaIds,
  _getCommonAreas,
  getCommonAreaOrderIndex,
  (commonAreaIds, commonAreas, commonAreaOrderIndex) => {
    const areas = commonAreaIds.map(id => commonAreas[id]);
    return sortCommonAreas(commonAreaOrderIndex, areas);
  }
);

export const getShopSearchTerm = createSelector(
  getOccupationState,
  fromOccupation.getShopSearchTerm,
);

export const getShopConnectFilter = createSelector(
  getOccupationState,
  fromOccupation.getShopConnectFilter,
);

export const getCommonAreaSearchTerm = createSelector(
  getOccupationState,
  fromOccupation.getCommonAreaSearchTerm,
);

export const getCommonAreaShopRelations = createSelector(
  getOccupationState,
  fromOccupation.getCommonAreaShopRelations
);

export const getCommonAreaWithSearching = createSelector(
  getCommonAreas,
  getShops,
  getCommonAreaShopRelations,
  getCommonAreaSearchTerm,
  (commmonAreas, shops, relationshipData, searchTerm) => {
    return commmonAreas.filter(ca => {

      let result = ca.isActive;

      if (searchTerm && result) {
        result = ((ca.name.toLocaleLowerCase().search(searchTerm.toLocaleLowerCase()) + 1) > 0);
      }

      return result;
    }).map(ca => {
      const commonArea = Object.assign({}, ca);

      const commonAreaRelationshipData = relationshipData[ca.id];

      let selectedCount = 0;
      shops.forEach(shop => {
        if (commonAreaRelationshipData && commonAreaRelationshipData[shop.id].isSelected) {
          selectedCount++;
        }
      });

      commonArea.isSelected = selectedCount >= shops.length;
      if (!commonArea.isSelected) {
        commonArea.isSelectedPartly = selectedCount > 0;
      }

      return commonArea;
    });
  }
);

export const getShopStatusFilter = createSelector(
  getOccupationState,
  fromOccupation.getShopStatusFilter
);

export const _getFilteringShops = createSelector(
  getShops,
  getCommonAreaIds,
  getShopSearchTerm,
  getShopConnectFilter,
  getCommonAreaShopRelations,
  (shops, commonAreaIds, searchTerm, connectFilter, commonAreaShopRelations) => {
    return shops.filter(shop => {
      let result = true;

      if (connectFilter) {
        let isSelected = false;
        for (let index = 0; index < commonAreaIds.length; index++) {
          isSelected = commonAreaShopRelations[commonAreaIds[index]][shop.id].isSelected;
          if (isSelected) {
            break;
          }
        }

        if (isSelected) {
          result = connectFilter == ShopFilter.ConnectedShop ? true : false;
        } else {
          result = connectFilter == ShopFilter.NotConnectedShop ? true : false;
        }
      }

      if (searchTerm && result) {
        result = (shop.name.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1);
      }

      return result;
    });
  }
);

export const getCommonAreaWithSearchingAndFilteringShops = createSelector(
  getCommonAreas,
  _getFilteringShops,
  getCommonAreaShopRelations,
  getCommonAreaSearchTerm,
  (commmonAreas, shops, relationshipData, searchTerm) => {
    return commmonAreas.filter(ca => {

      let result = ca.isActive;

      if (searchTerm && result) {
        result = ((ca.name.toLocaleLowerCase().search(searchTerm.toLocaleLowerCase()) + 1) > 0);
      }

      return result;
    }).map(ca => {
      const commonArea = Object.assign({}, ca);

      const commonAreaRelationshipData = relationshipData[ca.id];

      let selectedCount = 0;
      shops.forEach(shop => {
        if (commonAreaRelationshipData && commonAreaRelationshipData[shop.id].isSelected) {
          selectedCount++;
        }
      });

      commonArea.isSelected = selectedCount && selectedCount >= shops.length;
      if (!commonArea.isSelected) {
        commonArea.isSelectedPartly = selectedCount > 0;
      }

      return commonArea;
    });
  }
);

export const getShopWithFilteringAndSearching = createSelector(
  getShops,
  getCommonAreaShopRelations,
  getCommonAreaWithSearchingAndFilteringShops,
  getShopSearchTerm,
  getShopConnectFilter,
  (shops, relationshipData, commonAreas, searchTerm, connectFilter) => {
    return shops.filter(shop => {
      let result = true;

      if (connectFilter) {
        let isSelected = false;
        for (let index = 0; index < commonAreas.length; index++) {
          isSelected = relationshipData[commonAreas[index].id][shop.id].isSelected;
          if (isSelected) {
            break;
          }
        }

        if (isSelected) {
          result = connectFilter == ShopFilter.ConnectedShop ? true : false;
        } else {
          result = connectFilter == ShopFilter.NotConnectedShop ? true : false;
        }
      }

      if (searchTerm && result) {
        result = (shop.name.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1);
      }

      return result;
    }).map(s => {
      const shop = Object.assign({}, s);

      let selectedCount = 0;

      commonAreas.forEach(ca => {
        if (relationshipData[ca.id][shop.id].isSelected) {
          selectedCount++;
        }
      });

      shop.isSelected = selectedCount && selectedCount >= commonAreas.length;
      if (!shop.isSelected) {
        shop.isSelectedPartly = selectedCount > 0;
      }

      return shop;
    });
  }
);


export const getShopsWithFilteringByStatus = createSelector(
  getShops,
  getShopStatusFilter,
  getShopSearchTerm,
  getShopOrderIndex,
  (shops, statusFilter, searchTerm, shopOrderIndex) => {
    const filteredShops = shops.filter(shop => {
      let result = true;

      if (statusFilter && result) {
        const status = ShopHelper.getStatus(shop);
        if (statusFilter === ShopStatusFilter.ActiveShops) {
          result = status === ShopStatus.Occupied || status === ShopStatus.Vacant;
        }

        if (statusFilter === ShopStatusFilter.InactiveShops) {
          result = status === ShopStatus.Spare;
        }

        if (statusFilter === ShopStatusFilter.Occupied) {
          result = status === ShopStatus.Occupied;
        }

        if (statusFilter === ShopStatusFilter.Vacant) {
          result = status === ShopStatus.Vacant;
        }
      }

      if (searchTerm && result) {
        result = (shop.name.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1)
          || (shop.tenant && (shop.tenant.name.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1));
      }

      return result;
    });

    return sortShops(shopOrderIndex, filteredShops);

  }
);

export const shopsWithFilteringAndSerchByNameAndTenant = createSelector(
  getShops,
  getShopStatusFilter,
  getShopSearchTerm,
  getShopOrderIndex,
  (shops, statusFilter, searchTerm, shopOrderIndex) => {
    const filteredShops = shops.filter(shop => {

      let result = true;

      if (statusFilter && result) {
        const status = ShopHelper.getStatus(shop);
        if (statusFilter === ShopStatusFilter.ActiveShops) {
          result = status === ShopStatus.Occupied || status === ShopStatus.Vacant;
        }

        if (statusFilter === ShopStatusFilter.InactiveShops) {
          result = status === ShopStatus.Spare;
        }
      }

      if (searchTerm && result) {

        result = (shop.name.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1)
          || (shop.tenant && shop.tenant.name && (shop.tenant.name.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1));
      }

      return result;
    });

    return sortShops(shopOrderIndex, filteredShops);
  }
);

export const getCurrentStep = createSelector(
  getOccupationState,
  fromOccupation.getCurrentStep,
);

export const getSelectedCommonAreaLiabilityServiceType = createSelector(
  getOccupationState,
  fromOccupation.getSelectedCommonAreaLiabilityServiceType
);

const _getCommonAreaLiabilities = createSelector(
  getOccupationState,
  fromOccupation.getCommonAreaLiabilities
);

export const getCommonAreaLiabilities = createSelector(
  _getCommonAreas,
  _getCommonAreaLiabilities,
  getShops,
  getCommonAreaShopRelations,
  (commonAreas, commonAreaLiabilities, shops, commonAreaShopRelations) => {

    return commonAreaLiabilities.map(cal => {
      const commonAreaLiability = Object.assign({}, cal);
      commonAreaLiability.commonArea = commonAreas[cal.commonAreaId];

      commonAreaLiability.shopCount = 0;
      const commonAreaData = commonAreaShopRelations[cal.commonAreaId];
      let totalArea = 0;
      shops.forEach(shop => {
        const shopData = commonAreaData[shop.id];
        if (shopData && shopData.isSelected) {
          totalArea += shop.area;
          commonAreaLiability.shopCount++;
        }
      });
      commonAreaLiability.totalShopArea = totalArea.toFixed(2);
      return commonAreaLiability;
    });
  }
);

export const getSelectedCommonAreaLiabilityIdx = createSelector(
  getOccupationState,
  fromOccupation.getSelectedCommonAreaLiabilityIdx,
);

export const getSelectedCommonAreaLiability = createSelector(
  getCommonAreaLiabilities,
  getSelectedCommonAreaLiabilityIdx,
  (commonAreaLiabilities, idx) => {
    return commonAreaLiabilities[idx];
  }
);

export const getLiabilityShopSearchTerm = createSelector(
  getOccupationState,
  fromOccupation.getLiabilityShopSearchTerm
);

export const getLiabilityShopFilter = createSelector(
  getOccupationState,
  fromOccupation.getLiabilityShopFilter
);

export const getSelectedCommonAreaLiabilityService = createSelector(
  getSelectedCommonAreaLiability,
  getSelectedCommonAreaLiabilityServiceType,
  _getShops,
  getLiabilityShopFilter,
  getLiabilityShopSearchTerm,
  (getSelectedCommonAreaLiability, getSelectedCommonAreaLiabilityServiceType, shops, liabilityShopFilter, searchTerm) => {
    if (!getSelectedCommonAreaLiability) {
      return null;
    }

    let result: LiabilityViewModel = getSelectedCommonAreaLiability.liabilities.find(s => s.serviceType == getSelectedCommonAreaLiabilityServiceType);
    result = Object.assign({}, result, {
      totalShops: 0,
      totalSquare: 0,
      totalLiableShops: 0,
      totalVacantShops: 0,
      totalNotLiableShops: 0
    });

    result.shopLiabilities = result.shopLiabilities.map(s => {
      const shopLiability: ShopLiabilityViewModel = Object.assign({}, s);
      shopLiability.shop = Object.assign({}, shops[shopLiability.shopId]);
      shopLiability.status = shopLiability.shop.tenant && shopLiability.shop.tenant.name ? shopLiability.isLiable ? LiableShopStatus.LiableShops : LiableShopStatus.NotLiableShops : LiableShopStatus.VacantShops;

      return shopLiability;
    }).filter(shopLiability => !shopLiability.shop.isSpare);

    RelationshipDataCalculation.evaluateLiability(result, shops);

    result.shopLiabilities = result.shopLiabilities.filter(shopLiability => {
      let shopFilterResult = true;

      result.totalSquare += shopLiability.shop.area;
      result.totalShops++;

      switch (shopLiability.status) {
        case LiableShopStatus.LiableShops:
          result.totalLiableShops++;
          break;

        case LiableShopStatus.VacantShops:
          result.totalVacantShops++;
          break;

        case LiableShopStatus.NotLiableShops:
          result.totalNotLiableShops++;
          break;

        default:
          break;
      }

      if (liabilityShopFilter != LiableShopStatus.AllShops) {
        shopFilterResult = shopLiability.status == liabilityShopFilter;
      }

      if (searchTerm && result) {
        shopFilterResult = ((shopLiability.shop.name.toLocaleLowerCase().search(searchTerm.toLocaleLowerCase()) + 1) > 0);
      }

      return shopFilterResult;
    });


    return result;
  }
);


export const getCompleteStatus = createSelector(
  getOccupationState,
  fromOccupation.getCompleteStatus
);

export const getShopsWithSearchAndFilteringByStatus = createSelector(
  getShops,
  getShopStatusFilter,
  getShopSearchTerm,
  (shops, statusFilter, searchTerm) => {
    return shops.filter(shop => {
      let result = true;

      if (statusFilter) {
        const status = ShopHelper.getStatus(shop);

        if (statusFilter === ShopStatusFilter.ActiveShops) {
          result = status === ShopStatus.Occupied || status === ShopStatus.Vacant;
        }

        if (statusFilter === ShopStatusFilter.InactiveShops) {
          result = status === ShopStatus.Spare;
        }
      }

      if (searchTerm && result) {
        result = (shop.name.toLocaleLowerCase().search(searchTerm.toLocaleLowerCase()) !== -1);
      }

      return result;
    });
  }
);

export const getCommonAreaServiceLiabilities = createSelector(
  getCommonAreas,
  _getCommonAreaLiabilities,
  getCommonAreaSearchTerm,
  (commmonAreas, commonAreaLiabilities, searchTerm) => {
    const result = new Array<CommonAreaServiceLiabilityViewModel>();

    commmonAreas.forEach(ca => {

      let isCorrectCondition = ca.isActive;

      if (searchTerm && isCorrectCondition) {
        isCorrectCondition = ((ca.name.toLocaleLowerCase().search(searchTerm.toLocaleLowerCase()) + 1) > 0);
      }

      if (!isCorrectCondition) {
        return;
      }

      let commonAreaLiability = commonAreaLiabilities.find(c => c.commonAreaId === ca.id);

      if (commonAreaLiability) {
        const liabilities = [...commonAreaLiability.liabilities];
        const sortedAscLiabilities = liabilities.sort((a, b) => a.serviceType - b.serviceType);
        commonAreaLiability = {
          ...commonAreaLiability,
          liabilities: sortedAscLiabilities
        };

        commonAreaLiability.liabilities.forEach(l => {
          const model = new CommonAreaServiceLiabilityViewModel();
          model.commonArea = ca;
          model.liability = l;

          result.push(model);
        });
      } else {

        if (ca.services.isElectricityEnable) {
          const model = new CommonAreaServiceLiabilityViewModel();
          model.commonArea = ca;
          model.liability.serviceType = SupplyType.Electricity;
          result.push(model);
        }
        if (ca.services.isWaterEnable) {
          const model = new CommonAreaServiceLiabilityViewModel();
          model.commonArea = ca;
          model.liability.serviceType = SupplyType.Water;
          result.push(model);
        }
        if (ca.services.isSewerageEnable) {
          const model = new CommonAreaServiceLiabilityViewModel();
          model.commonArea = ca;
          model.liability.serviceType = SupplyType.Sewerage;
          result.push(model);
        }
        if (ca.services.isGasEnable) {
          const model = new CommonAreaServiceLiabilityViewModel();
          model.commonArea = ca;
          model.liability.serviceType = SupplyType.Gas;
          result.push(model);
        }
        if (ca.services.isOtherEnable) {
          const model = new CommonAreaServiceLiabilityViewModel();
          model.commonArea = ca;
          model.liability.serviceType = SupplyType.AdHoc;
          result.push(model);
        }

      }
    });

    return result;
  }
);

export const getShopCount = createSelector(
  getShopIds,
  (items) => {
    return items.length;
  }
);

export const getCommonAreaCount = createSelector(
  getCommonAreaIds,
  (items) => {
    return items.length;
  }
);

export const canEdit = createSelector(
  getOccupationState,
  fromOccupation.canEdit
);

export const getActiveCommonAreas = createSelector(
  getCommonAreaIds,
  _getCommonAreas,
  getCommonAreaSearchTerm,
  (commonAreaIds, commonAreas, searchTerm) => {
    return commonAreaIds.map(id => commonAreas[id])
      .filter(ca => {
        let result = ca.isActive;

        if (searchTerm && result) {
          result = ((ca.name.toLocaleLowerCase().search(searchTerm.toLocaleLowerCase()) + 1) > 0);
        }

        return result;
      });
  }
);

export const getComplexLiabilityShopFilter = createSelector(
  getOccupationState,
  fromOccupation.getComplexLiabilityShopFilter
);

export const getFilteredShopsForLiability = createSelector(
  getShops,
  getActiveCommonAreas,
  getComplexLiabilityShopFilter,
  getShopSearchTerm,
  getCommonAreaShopRelations,
  (shops, commonAreas, filter, searchTerm, commonAreaShopRelations) => {
    return shops.filter(shop => {
      let result = !shop.isSpare;

      if (result) {
        switch (filter) {
          case ComplexLiabilityShopFilter.ConnectedShops:
            result = commonAreas.filter(c => commonAreaShopRelations[c.id][shop.id].isSelected).length > 0;
            break;
          case ComplexLiabilityShopFilter.NotConnectedShops:
            result = commonAreas.filter(c => commonAreaShopRelations[c.id][shop.id].isSelected).length === 0;
            break;
          case ComplexLiabilityShopFilter.LiableShops:
            result = commonAreas.filter(c => commonAreaShopRelations[c.id][shop.id].liabilities.filter(l => l.isLiable).length).length > 0;
            break;
          case ComplexLiabilityShopFilter.NotLiableShops:
            result = commonAreas.filter(c => commonAreaShopRelations[c.id][shop.id].liabilities.filter(l => l.isLiable).length).length === 0;
            break;
          case ComplexLiabilityShopFilter.VacantShops:
            result = ShopHelper.getStatus(shop) === ShopStatus.Vacant;
            break;
          default:
            break;
        }
      }

      if (searchTerm && result) {
        result = ((shop.name.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase())) !== -1) ||
          (shop.tenant && (shop.tenant.name.toLocaleLowerCase().search(searchTerm.toLocaleLowerCase()) + 1) > 0);
      }

      return result;
    });
  }
);

const _getHistoryIds = createSelector(
  getOccupationState,
  fromOccupation.getHistoryIds,
);

const _getHistories = createSelector(
  getOccupationState,
  fromOccupation.getHistories,
);

export const getHistories = createSelector(
  _getHistoryIds,
  _getHistories,
  (ids, histories) => ids.map(id => histories[id])
);

const _getCurrentHistoryId = createSelector(
  getOccupationState,
  fromOccupation.getCurrentHistoryId
);

export const getCurrentHistory = createSelector(
  _getCurrentHistoryId,
  _getHistories,
  (id, histories) => histories[id]
);

export const getUpdateDate = createSelector(
  getOccupationState,
  fromOccupation.getUpdateDate
);

export const getComment = createSelector(
  getOccupationState,
  fromOccupation.getComment
);

const sortShops = (order, shops: ShopViewModel[]) => {

  shops = [...shops];

  switch (order) {
    case ShopOrder.ShopNameAsc:
      return shops.sort((a, b) => sortRule(a.name, b.name));
    case ShopOrder.ShopNameDesc:
      return shops.sort((a, b) => sortRule(b.name, a.name));
    case ShopOrder.TenantNameAsc:
      return shops.sort((a, b) => sortRule(a.tenant.name, b.tenant.name));
    case ShopOrder.TenantNameDesc:
      return shops.sort((a, b) => sortRule(b.tenant.name, a.tenant.name));
    case ShopOrder.AreaAsc:
      return shops.sort((a, b) => sortRule(a.area, b.area));
    case ShopOrder.AreaDesc:
      return shops.sort((a, b) => sortRule(b.area, a.area));
    case ShopOrder.StatusAsc:
      return shops.sort((a, b) => sortRule(ShopHelper.getStatus(a), ShopHelper.getStatus(b)));
    case ShopOrder.StatusDesc:
      return shops.sort((a, b) => sortRule(ShopHelper.getStatus(b), ShopHelper.getStatus(a)));
    case ShopOrder.FloorAsc:
      return shops.sort((a, b) => sortRule(a.floor, b.floor));
    case ShopOrder.FloorDesc:
      return shops.sort((a, b) => sortRule(b.floor, a.floor));
    default:
      return shops;
  }
};

const sortCommonAreas = (order, commonAreas: CommonAreaViewModel[]) => {

  commonAreas = [...commonAreas];

  switch (order) {
    case CommonAreaOrder.CommonAreaNameAsc:
      return commonAreas.sort((a, b) => sortRule(a.name, b.name));
    case CommonAreaOrder.CommonAreaNameDesc:
      return commonAreas.sort((a, b) => sortRule(b.name, a.name));
    case CommonAreaOrder.FloorAsc:
      return commonAreas.sort((a, b) => sortRule(a.floor, b.floor));
    case CommonAreaOrder.FloorDesc:
      return commonAreas.sort((a, b) => sortRule(b.floor, a.floor));
    default:
      return commonAreas;
  }
};

const sortRule = (a, b) => {
  return (a > b) ? 1 : (a < b) ? -1 : 0;
};

// #endregion

// #region Building Floors Selectors

export const getFloorPlansState = createSelector(
  _getOccupationState,
  (state: any) => state.floorPlans
);

// #endregion

// #region Building Step Wizard Selectors

export const getBuildingStepWizardState = createSelector(
  _getOccupationState,
  (state: any) => state.buildingStepWizard
);

export const getBuildingStepWizardLocations = createSelector(
  getBuildingStepWizardState,
  fromBuildingStepWizard.getLocations
);

// #endregion

// #region Equipment Template Selectors

export const getEquipmentTemplateState = createSelector(
  _getOccupationState,
  (state: any) => state.equipmentTemplate
);

export const getEquipmentTemplates = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getEquipmentTemplates
);

export const getEquipmentTemplateSearchKey = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getSearchKey
);

export const getEquipmentTemplateOrder = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getOrder
);

export const getEquipmentTemplatePage = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getPage
);

export const getEquipmentTemplateUnitsPerPage = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getUnitsPerPage
);

export const getAssignFilter = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getAssignFilter
);

export const getAssignedEquipmentTemplatesCount = createSelector(
  getEquipmentTemplates,
  (equipmentTemplates) => {
    return equipmentTemplates.filter(e => e.isAssigned).length;
  }
);

export const getFilterDetail = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getFilterDetail
);

export const getAllEquipmentTemplateModels = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getAllEquipmentTemplateModels
);

export const getTotal = createSelector(
  getEquipmentTemplateState,
  fromEquipmentTemplate.getTotal
);

// #endregion
