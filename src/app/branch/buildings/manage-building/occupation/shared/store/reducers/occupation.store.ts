import * as occupationAction from '../actions/occupation.actions';

import {CommonAreaShopRelationsItemViewModel, CommonAreaShopRelationsViewModel, HistoryViewModel} from '../../models';

import {StringExtension} from 'app/shared/helper/string-extension';
import {OccupetionStoreEx} from './occupation.store.ex';
import {
  CommonAreaLiabilityViewModel,
  CommonAreaViewModel,
  ComplexLiabilityShopFilter,
  Dictionary,
  LiabilityViewModel,
  LiableShopStatus,
  ShopFilter,
  ShopLiabilityViewModel,
  ShopStatus,
  ShopViewModel,
  SupplyType,
  TenantViewModel
} from '@models';
import {ShopHelper} from 'app/branch/buildings/manage-building/occupation/shared/helpers/shop.helper';
import {BuildingPeriodViewModel} from 'app/branch/buildings/manage-building/shared/models/building-period.model';

export interface State {
  //TODO RT: Refactor occupations functionality to use commonData field instead
  buildingId: string;
  canEdit: boolean;
  shopIds: string[];
  shops: Dictionary<ShopViewModel>;

  commonAreaIds: string[];
  commonAreas: Dictionary<CommonAreaViewModel>;

  commonAreaShopRelations: Dictionary<Dictionary<CommonAreaShopRelationsViewModel>>;

  commonAreaLiabilities: CommonAreaLiabilityViewModel[];
  isComplete: boolean;
  shopSearchTerm: string;
  shopConnectFilter: number;
  shopStatusFilter: number;
  commonAreasSearchTerm: string;

  selectedCommonAreaLiabilityIdx: number;
  selectedCommonAreaLiabilityServiceType: number;
  currentStep: number;
  liabilityShopSearchTerm: string;
  liabilityShopFilter: LiableShopStatus;
  complexLiabilityShopFilter: ComplexLiabilityShopFilter;
  comment: string;
  tenants: TenantViewModel[];

  updateDate: Date;
  historyIds: string[];
  histories: Dictionary<HistoryViewModel>;
  versionId: string;

  shopOrderIndex: number;
  commonAreaOrderIndex: number;

  buildingPeriod: BuildingPeriodViewModel;
}

export const initialState: State = {
  buildingId: null,
  canEdit: true,
  shopIds: [],
  shops: {},
  commonAreas: {},
  commonAreaIds: [],
  commonAreaLiabilities: [],
  isComplete: false,
  commonAreaShopRelations: {},
  selectedCommonAreaLiabilityIdx: 0,
  selectedCommonAreaLiabilityServiceType: 0,
  currentStep: 0,
  shopSearchTerm: null,
  shopConnectFilter: 0,
  shopStatusFilter: 0,
  commonAreasSearchTerm: null,
  liabilityShopSearchTerm: null,
  liabilityShopFilter: LiableShopStatus.AllShops,
  complexLiabilityShopFilter: ComplexLiabilityShopFilter.AllShops,
  comment: null,
  updateDate: new Date(),
  historyIds: [],
  histories: {},
  versionId: null,
  tenants: [],
  shopOrderIndex: 0,
  commonAreaOrderIndex: 0,
  buildingPeriod: null
};

export function reducer(state = initialState, action: occupationAction.Action) {

  switch (action.type) {
    case occupationAction.GET_OCCUPATION_COMPLETE: {

      return {
        ...state,
        ...action.payload
      };
    }

    case occupationAction.SET_TENANTS: {
      return state;
    }

    case occupationAction.GET_TENANTS: {
      return {
        ...state, tenants: action.payload
      };
    }

    case occupationAction.REQUEST_GET_SHOP_HISTORY: {
      const shopId = action.payload;
      const shop = {...state.shops[shopId]};
      shop.isExpanded = true;

      if (!shop.tenantShopHistory) {
        shop.tenantShopHistory = [];
      }

      return {
        ...state,
        shops: {
          ...state.shops,
          [shopId]: shop
        }
      };
    }

    case occupationAction.SHOP_HISTORY_CLOSE: {
      const shopId = action.payload;
      const shop = {...state.shops[shopId]};
      shop.isExpanded = false;

      return {
        ...state,
        shops: {
          ...state.shops,
          [shopId]: shop
        }
      };
    }

    case occupationAction.REQUEST_GET_SHOP_HISTORY_COMPLETE: {
      const shopId = action.payload.shopId;
      const shop = {...state.shops[shopId]};

      shop.tenantShopHistory = action.payload.history;

      return {
        ...state,
        shops: {
          ...state.shops,
          [shopId]: shop
        }
      };
    }

    case occupationAction.SET_SHOPS: {
      const shopsDict: Dictionary<ShopViewModel> = {};

      action.payload.forEach(shop => {
        shopsDict[shop.id] = shop;
      });

      const shopIds = action.payload.map(shop => shop.id);

      return {
        ...state,
        shopIds: [...state.shopIds, ...shopIds],
        shops: {...state.shops, ...shopsDict,}
      };
    }

    case occupationAction.RETURN_DEFAULT_SHOPS: {

      const defaultShops = {};
      action.payload.defaultShops.map(item => {
        defaultShops[item.id] = item;
      });

      return {
        ...state,
        shopIds: action.payload.shopIds,
        shops: defaultShops
      };
    }

    case occupationAction.ADD_SHOP: {
      const shops = {...state.shops};
      const newShop = new ShopViewModel();
      newShop.id = StringExtension.NewGuid();
      newShop.area = 0;
      newShop.tenant = new TenantViewModel();
      newShop.floor = 0;

      const shopNumbers = Object.values(shops)
        .map(({name}) => name.includes('New Shop') ? Number(name.replace(/[^0-9]/g, '')) : null)
        .filter(shopNumber => shopNumber);

      const existingIndexesSet = new Set(shopNumbers);
      let newShopNumber = 1;

      while (existingIndexesSet.has(newShopNumber)) {
        newShopNumber++;
      }

      newShop.name = `New Shop ${newShopNumber}`;
      shops[newShop.id] = newShop;

      const relations = {...state.commonAreaShopRelations};

      state.commonAreaIds.forEach(commonAreaId => {
        const relation = new CommonAreaShopRelationsViewModel();
        relation.commmonAreaId = commonAreaId;
        relation.shopId = newShop.id;
        relation.isSelected = false;

        relation.liabilities = OccupetionStoreEx.initRelations(state.commonAreas[commonAreaId].services);
        relations[commonAreaId][newShop.id] = relation;
      });

      return {
        ...state,
        shopIds: [...state.shopIds, newShop.id],
        shops: shops,
        commonAreaShopRelations: relations
      };
    }

    case occupationAction.UPDATE_SHOP: {

      const updateShop = Object.assign({}, state.shops[action.payload.id]);
      if ('tenant.name' !== action.payload.path && 'tenant.id' !== action.payload.path) {
        updateShop[action.payload.path] = action.payload.value;
      } else {
        if (updateShop['tenant'] == null) {
          updateShop['tenant'] = new TenantViewModel();
        }
        if (action.payload.path == 'tenant.name') {
          updateShop['tenant']['name'] = action.payload.value;
        }
        if (action.payload.path == 'tenant.id') {
          updateShop['tenant'] = state.tenants.find(t => t.id == action.payload.value);
        }
      }

      const shops = {...state.shops};
      shops[action.payload.id] = updateShop;

      return {
        ...state,
        shops: shops
      };
    }


    case occupationAction.DELETE_SHOP: {
      delete state.shops[action.payload];
      return {
        ...state,
        shopIds: state.shopIds.filter(id => id !== action.payload)
      };

    }

    case occupationAction.RETURN_DEFAULT_AREA: {
      const defaultArea = {};
      action.payload.defaultAreas.map(item => {
        defaultArea[item.id] = item;
      });

      return {
        ...state,
        commonAreaIds: action.payload.areaIds,
        commonAreas: defaultArea
      };
    }

    case occupationAction.ADD_COMMON_AREA: {

      const newCommonArea: Dictionary<CommonAreaViewModel> = {};
      const newGuid = StringExtension.NewGuid();
      
      newCommonArea[newGuid] = new CommonAreaViewModel();
      newCommonArea[newGuid].id = newGuid;
      newCommonArea[newGuid].name = 'New Common Area';
      newCommonArea[newGuid].floor = 0;
      newCommonArea[newGuid].isActive = true;

      if (action.payload) {
        newCommonArea[newGuid].name += ' ' + action.payload;
      }

      const commonAreas = {...state.commonAreas, ...newCommonArea};

      return {
        ...state,
        commonAreaIds: [...state.commonAreaIds, newGuid],
        commonAreas: commonAreas
      };
    }

    case occupationAction.ADD_COMMON_AREAS: {
      const commonAreas = state.commonAreas;
      const commonAreaIds = new Array<string>();
      for (let i = 1; i <= +action.payload; i++) {

        const newCommonArea = new CommonAreaViewModel();
        newCommonArea.id = StringExtension.NewGuid();
        newCommonArea.name = 'New Common Area ' + i;
        newCommonArea.floor = 0;
        commonAreaIds.push(newCommonArea.id);

        commonAreas[newCommonArea.id] = newCommonArea;
      }

      return {
        ...state,
        commonAreaIds: [...state.commonAreaIds, ...commonAreaIds],
        commonAreas: {...commonAreas}
      };
    }

    case occupationAction.UPDATE_COMMON_AREA: {

      const updateCommonArea = {};
      updateCommonArea[action.payload.path] = action.payload.value;

      const commonAreas = {...state.commonAreas};
      commonAreas[action.payload.id] = {...commonAreas[action.payload.id], ...updateCommonArea};

      return {
        ...state,
        commonAreas: commonAreas
      };
    }

    case occupationAction.DELETE_COMMON_AREA: {
      const newCommonAreaShopRelations = {...state.commonAreaShopRelations};
      delete newCommonAreaShopRelations[action.payload];
      const newCommonAreas = {...state.commonAreas};
      delete newCommonAreas[action.payload];
      return {
        ...state,
        commonAreaIds: state.commonAreaIds.filter(id => id !== action.payload),
        commonAreaLiabilities: state.commonAreaLiabilities.filter(ca => ca.commonAreaId !== action.payload),
        commonAreaShopRelations: newCommonAreaShopRelations,
        commonAreas: newCommonAreas
      };
    }

    case occupationAction.ADD_COMMON_AREA_SHOP: {

      const relation = Object.assign({}, state.commonAreaShopRelations[action.payload.commonAreaId][action.payload.shopId]);

      relation.isSelected = true;

      if (!relation.liabilities.length) {
        const relations = OccupetionStoreEx.initRelations(state.commonAreas[action.payload.commonAreaId].services);
        relation.liabilities = relation.liabilities.concat(relations);
      }

      relation.liabilities.forEach(rl => {
        rl.allocation = state.shops[action.payload.shopId].area;
        rl.isLiable = true;
      });

      state.commonAreaShopRelations[action.payload.commonAreaId][action.payload.shopId] = relation;
      let commonAreaLiabilities = [...state.commonAreaLiabilities];
      let commonAreaLiability = commonAreaLiabilities.find(cal => cal.commonAreaId == action.payload.commonAreaId);
      if (commonAreaLiability) {
        commonAreaLiability.liabilities = [...commonAreaLiability.liabilities];
      } else {
        commonAreaLiability = new CommonAreaLiabilityViewModel();
        commonAreaLiability.commonAreaId = action.payload.commonAreaId;
        commonAreaLiability.liabilities = OccupetionStoreEx.initLiabilities(state.commonAreas[action.payload.commonAreaId].services);
      }

      commonAreaLiability.liabilities.forEach(l => {
        let shopLiability = l.shopLiabilities.find(sl => sl.shopId == action.payload.shopId);
        if (!shopLiability) {
          shopLiability = new ShopLiabilityViewModel();
          shopLiability.allocation = state.shops[action.payload.shopId].area;
          shopLiability.shop = state.shops[action.payload.shopId];
          shopLiability.shopId = action.payload.shopId;

          l.shopLiabilities.push(shopLiability);
        }
      });

      commonAreaLiabilities = commonAreaLiabilities.filter(cal => cal.commonAreaId != action.payload.commonAreaId);
      commonAreaLiabilities.push(commonAreaLiability);

      return {
        ...state,
        commonAreaShopRelations: {...state.commonAreaShopRelations},
        commonAreaLiabilities: commonAreaLiabilities
      };
    }

    case occupationAction.DELETE_COMMON_AREA_SHOP: {

      state.commonAreaShopRelations[action.payload.commonAreaId][action.payload.shopId] = Object.assign({}, state.commonAreaShopRelations[action.payload.commonAreaId][action.payload.shopId]);
      state.commonAreaShopRelations[action.payload.commonAreaId][action.payload.shopId].isSelected = false;

      return {
        ...state,
        commonAreaShopRelations: {...state.commonAreaShopRelations}
      };
    }

    case occupationAction.CHECK_ALL_COMMON_AREA_SHOPS: {

      const updateCommonAreaLiability = Object.assign({}, state.commonAreaShopRelations[action.payload]);

      state.shopIds.map(id => state.shops[id])
        .filter(shop => {
          let result = true;
          const connectFilter = state.shopConnectFilter;
          const searchTerm = state.shopSearchTerm;

          if (connectFilter) {
            let isSelected = false;
            for (let index = 0; index < state.commonAreaIds.length; index++) {
              isSelected = state.commonAreaShopRelations[state.commonAreaIds[index]][shop.id].isSelected;
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
        })
        .forEach(shop => {
          updateCommonAreaLiability[shop.id] = Object.assign({}, updateCommonAreaLiability[shop.id]);

          updateCommonAreaLiability[shop.id].isSelected = true;

          if (updateCommonAreaLiability[shop.id].liabilities.length == 0) {
            OccupetionStoreEx.initLiabilities(state.commonAreas[action.payload].services).forEach(l => {
              const commonAreaShopRelationsItemViewModel = new CommonAreaShopRelationsItemViewModel();
              commonAreaShopRelationsItemViewModel.isLiable = true;
              commonAreaShopRelationsItemViewModel.allocation = state.shops[shop.id].area;
              commonAreaShopRelationsItemViewModel.serviceType = l.serviceType;

              updateCommonAreaLiability[shop.id].liabilities.push(commonAreaShopRelationsItemViewModel);
            });
          }

          updateCommonAreaLiability[shop.id].liabilities = updateCommonAreaLiability[shop.id].liabilities.map(l => {
            return Object.assign({}, l, {isLiable: true});
          });
        });

      return {
        ...state,
        commonAreaShopRelations: {
          ...state.commonAreaShopRelations,
          [action.payload]: {
            ...updateCommonAreaLiability
          }
        }
      };
    }

    case occupationAction.UNCHECK_ALL_COMMON_AREA_SHOPS: {

      const updateCommonAreaLiability = Object.assign({}, state.commonAreaShopRelations[action.payload]);

      state.shopIds.map(id => state.shops[id])
        .filter(shop => {
          let result = true;
          const connectFilter = state.shopConnectFilter;
          const searchTerm = state.shopSearchTerm;

          if (connectFilter) {
            let isSelected = false;
            for (let index = 0; index < state.commonAreaIds.length; index++) {
              isSelected = state.commonAreaShopRelations[state.commonAreaIds[index]][shop.id].isSelected;
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
        })
        .forEach(shop => {
          updateCommonAreaLiability[shop.id] = Object.assign({}, updateCommonAreaLiability[shop.id], {isSelected: false});
        });

      return {
        ...state,
        commonAreaShopRelations: {
          ...state.commonAreaShopRelations,
          [action.payload]: {
            ...updateCommonAreaLiability
          }
        }
      };
    }

    case occupationAction.CHECK_ALL_SHOP_COMMON_AREAS: {

      const result = {};
      const searchTerm = state.commonAreasSearchTerm;

      state.commonAreaIds.map(id => state.commonAreas[id])
        .filter(commonArea => {

          let result = commonArea.isActive;

          if (searchTerm && result) {
            result = ((commonArea.name.toLocaleLowerCase().search(searchTerm.toLocaleLowerCase()) + 1) > 0);
          }

          return result;
        })
        .forEach(commonArea => {
          result[commonArea.id] = Object.assign({}, state.commonAreaShopRelations[commonArea.id]);
          result[commonArea.id][action.payload] = Object.assign({}, result[commonArea.id][action.payload], {isSelected: true});
        });

      return {
        ...state,
        commonAreaShopRelations: {
          ...state.commonAreaShopRelations,
          ...result
        }
      };
    }

    case occupationAction.UNCHECK_ALL_SHOP_COMMON_AREAS: {

      const result = {};
      const searchTerm = state.commonAreasSearchTerm;

      state.commonAreaIds.map(id => state.commonAreas[id])
        .filter(commonArea => {

          let result = commonArea.isActive;

          if (searchTerm && result) {
            result = ((commonArea.name.toLocaleLowerCase().search(searchTerm.toLocaleLowerCase()) + 1) > 0);
          }

          return result;
        })
        .forEach(commonArea => {
          result[commonArea.id] = Object.assign({}, state.commonAreaShopRelations[commonArea.id]);
          result[commonArea.id][action.payload] = Object.assign({}, result[commonArea.id][action.payload], {isSelected: false});
        });

      return {
        ...state,
        commonAreaShopRelations: {
          ...state.commonAreaShopRelations,
          ...result
        }
      };
    }

    case occupationAction.UPDATE_SHOP_SEARCH_TERM: {

      return {
        ...state,
        shopSearchTerm: action.payload
      };
    }

    case occupationAction.UPDATE_COMMON_AREA_SEARCH_TERM: {

      return {
        ...state,
        commonAreasSearchTerm: action.payload
      };
    }

    case occupationAction.UPDATE_SHOP_CONNECT_FILTER: {

      return {
        ...state,
        shopConnectFilter: action.payload
      };
    }

    case occupationAction.UPDATE_RELATIONSHIP_DATA: {
      return {
        ...state,
        commonAreaShopRelations: action.payload
      };
    }

    case occupationAction.SET_VACANT_STATUS_FOR_MULTIPLE_SHOPS: {
      const updateValue = {tenant: null, isSpare: false};

      const shops = state.shops;

      action.payload.forEach(id => {
        shops[id] = Object.assign({}, shops[id], updateValue);
      });

      return {
        ...state,
        shops: {...shops}
      };
    }

    case occupationAction.SET_SPARE_STATUS_FOR_MULTIPLE_SHOPS: {
      const updateValue = {tenant: null, isSpare: true};

      const shops = state.shops;

      action.payload.forEach(id => {
        shops[id] = Object.assign({}, shops[id], updateValue);
      });

      return {
        ...state,
        shops: {...shops}
      };
    }

    case occupationAction.SET_UNSPARE_STATUS_FOR_MULTIPLE_SHOPS: {
      const updateValue = {isSpare: false};

      const shops = state.shops;

      action.payload.forEach(id => {
        shops[id] = Object.assign({}, shops[id], updateValue);
      });

      return {
        ...state,
        shops: {...shops}
      };
    }

    case occupationAction.MERGE_SHOPS: {

      const newShop = new ShopViewModel();
      newShop.id = StringExtension.NewGuid();
      newShop.area = 0;
      newShop.floor = null;

      action.payload.forEach(id => {
        newShop.area += state.shops[id].area;

        if (!newShop.name && state.shops[id].name) {
          newShop.name = state.shops[id].name;
        }

        if (!newShop.tenant.name && state.shops[id].tenant && state.shops[id].tenant.name) {
          newShop.tenant.name = state.shops[id].tenant.name;
        }

        if (!newShop.floor && state.shops[id].floor) {
          newShop.floor = state.shops[id].floor;
        }
      });

      const shops = {...state.shops};
      shops[newShop.id] = newShop;


      const relations = JSON.parse(JSON.stringify(state.commonAreaShopRelations));

      state.commonAreaIds.forEach(commonAreaId => {
        const relation = new CommonAreaShopRelationsViewModel();
        relation.commmonAreaId = commonAreaId;
        relation.shopId = newShop.id;
        relation.isSelected = false;

        relation.liabilities = OccupetionStoreEx.initRelations(state.commonAreas[commonAreaId].services);

        relations[commonAreaId][newShop.id] = relation;
      });

      return {
        ...state,
        shopIds: [...state.shopIds.filter(id => !action.payload.includes(id)), newShop.id],
        shops: shops,
        commonAreaShopRelations: relations
      };
    }

    case occupationAction.SPLIT_SHOP: {

      const shops = {...state.shops};
      const reletationData = {...state.commonAreaShopRelations};

      const shopIds = state.shopIds.filter(id => id !== action.payload.previousShop.id);
      action.payload.shops.forEach(shop => {
        shopIds.push(shop.id);
        shops[shop.id] = shop;
        state.commonAreaIds.forEach(commonAreaId => {
          const relation = new CommonAreaShopRelationsViewModel();
          relation.commmonAreaId = commonAreaId;
          relation.shopId = shop.id;
          relation.isSelected = false;

          const relations = OccupetionStoreEx.initRelations(state.commonAreas[commonAreaId].services, shop.area);
          relation.liabilities = relation.liabilities.concat(relations);

          reletationData[commonAreaId][shop.id] = relation;

        });
      });

      return {
        ...state,
        shopIds: shopIds,
        shops: shops,
        commonAreaShopRelations: reletationData
      };
    }

    case occupationAction.UPDATE_SHOP_STATUS_FILTER: {

      return {
        ...state,
        shopStatusFilter: action.payload
      };
    }

    case occupationAction.WIZARD_STEP_CHANGED: {
      const nextStep: number = action.payload;

      return {
        ...state,
        currentStep: state.currentStep + nextStep
      };
    }

    case occupationAction.COMMON_AREA_LIABILITY_SELECTED: {
      const commonAreaId = state.commonAreaLiabilities[action.payload].commonAreaId;
      const services = state.commonAreas[commonAreaId].services;

      let selectedService: SupplyType;
      if (services.isElectricityEnable) {
        selectedService = SupplyType.Electricity;
      } else if (services.isWaterEnable) {
        selectedService = SupplyType.Water;
      } else if (services.isSewerageEnable) {
        selectedService = SupplyType.Sewerage;
      } else if (services.isGasEnable) {
        selectedService = SupplyType.Gas;
      } else if (services.isOtherEnable) {
        selectedService = SupplyType.AdHoc;
      }

      return {
        ...state,
        selectedCommonAreaLiabilityIdx: action.payload,
        selectedCommonAreaLiabilityServiceType: selectedService
      };
    }

    case occupationAction.COMMON_AREA_LIABILITY_SERVICE_SELECTED: {
      return {
        ...state,
        selectedCommonAreaLiabilityServiceType: action.payload
      };
    }

    case occupationAction.UPDATE_OWNER_LIABILITY_FOR_SERVICE: {
      const commonAreaLiabilities = state.commonAreaLiabilities.map((commonAreaLiability, idx) => {
        if (idx == state.selectedCommonAreaLiabilityIdx) {
          const currentLiability = commonAreaLiability.liabilities.find(l => l.serviceType == state.selectedCommonAreaLiabilityServiceType);
          if (currentLiability.defaultSettings) {
            commonAreaLiability.liabilities = commonAreaLiability.liabilities.map(liability => {
              if (liability.defaultSettings) {
                return {
                  ...liability,
                  ownerLiable: action.payload
                };
              }

              return liability;
            });
          } else {
            commonAreaLiability.liabilities = commonAreaLiability.liabilities.map(liability => {
              if (liability.serviceType == state.selectedCommonAreaLiabilityServiceType) {
                return {
                  ...liability,
                  ownerLiable: action.payload
                };
              }

              return liability;
            });
          }
        }

        return commonAreaLiability;
      });

      return {
        ...state,
        commonAreaLiabilities: commonAreaLiabilities
      };
    }

    case occupationAction.UPDATE_INCLUDE_NOT_LIABLE_SHOPS_CHANGED_FOR_SERVICE: {
      const commonAreaLiabilities = state.commonAreaLiabilities.map((commonAreaLiability, idx) => {
        if (idx == state.selectedCommonAreaLiabilityIdx) {
          const currentLiability = commonAreaLiability.liabilities.find(l => l.serviceType == state.selectedCommonAreaLiabilityServiceType);
          if (currentLiability.defaultSettings) {
            commonAreaLiability.liabilities = commonAreaLiability.liabilities.map(liability => {
              if (liability.defaultSettings) {
                return {
                  ...liability,
                  includeNotLiableShops: action.payload
                };
              }

              return liability;
            });
          } else {
            commonAreaLiability.liabilities = commonAreaLiability.liabilities.map(liability => {
              if (liability.serviceType == state.selectedCommonAreaLiabilityServiceType) {
                return {
                  ...liability,
                  includeNotLiableShops: action.payload
                };
              }

              return liability;
            });
          }
        }

        return commonAreaLiability;
      });

      return {
        ...state,
        commonAreaLiabilities: commonAreaLiabilities
      };
    }

    case occupationAction.UPDATE_INCLUDE_VACANT_SHOP_SQM_CHANGED_FOR_SERVICE: {
      const commonAreaLiabilities = state.commonAreaLiabilities.map((commonAreaLiability, idx) => {
        if (idx == state.selectedCommonAreaLiabilityIdx) {
          const currentLiability = commonAreaLiability.liabilities.find(l => l.serviceType == state.selectedCommonAreaLiabilityServiceType);
          if (currentLiability.defaultSettings) {
            commonAreaLiability.liabilities = commonAreaLiability.liabilities.map(liability => {
              if (liability.defaultSettings) {
                return {
                  ...liability,
                  includeVacantShopSqM: action.payload
                };
              }

              return liability;
            });
          } else {
            commonAreaLiability.liabilities = commonAreaLiability.liabilities.map(liability => {
              if (liability.serviceType == state.selectedCommonAreaLiabilityServiceType) {
                return {
                  ...liability,
                  includeVacantShopSqM: action.payload
                };
              }

              return liability;
            });
          }
        }

        return commonAreaLiability;
      });

      return {
        ...state,
        commonAreaLiabilities: commonAreaLiabilities
      };
    }

    case occupationAction.UPDATE_LIABILITY_DEFAULT_SETTINGS: {
      const commonAreaLiabilities = state.commonAreaLiabilities.map((commonAreaLiability, idx) => {
        if (idx == state.selectedCommonAreaLiabilityIdx) {
          commonAreaLiability.liabilities = commonAreaLiability.liabilities.map(liability => {
            if (liability.serviceType == state.selectedCommonAreaLiabilityServiceType) {

              const updateLiability: LiabilityViewModel = {
                ...liability,
                defaultSettings: action.payload
              };

              const defaultLiability = commonAreaLiability.liabilities.find(l => l.defaultSettings);

              if (action.payload && defaultLiability) {
                updateLiability.ownerLiable = defaultLiability.ownerLiable;
                updateLiability.includeVacantShopSqM = defaultLiability.includeVacantShopSqM;
                updateLiability.includeNotLiableShops = defaultLiability.includeNotLiableShops;
                updateLiability.splitType = defaultLiability.splitType;
                updateLiability.shopLiabilities = defaultLiability.shopLiabilities.map(s => {
                  const shop = new ShopLiabilityViewModel();
                  shop.allocation = s.allocation;
                  shop.isLiable = s.isLiable;
                  shop.shopId = s.shopId;
                  return shop;
                });
              }

              return updateLiability;
            }

            return liability;
          });
        }

        return commonAreaLiability;
      });

      return {
        ...state,
        commonAreaLiabilities: commonAreaLiabilities
      };
    }

    case occupationAction.UPDATE_SHOP_ALLOCATION: {
      const relationShipdata = {...state.commonAreaShopRelations};

      const commonAreaLiabilities = state.commonAreaLiabilities.map((commonAreaLiability, idx) => {
        if (idx == state.selectedCommonAreaLiabilityIdx) {
          commonAreaLiability.liabilities = commonAreaLiability.liabilities.map((liability, calIdx) => {
            if (liability.serviceType == state.selectedCommonAreaLiabilityServiceType) {
              liability.shopLiabilities = liability.shopLiabilities.map(shopLiabilit => {
                if (shopLiabilit.shopId == action.payload.id) {
                  let data = relationShipdata[commonAreaLiability.commonAreaId][action.payload.id];

                  data = Object.assign({}, data);
                  data.liabilities[calIdx].allocation = action.payload.allocation;
                  relationShipdata[commonAreaLiability.commonAreaId][action.payload.id] = data;

                  return {
                    ...shopLiabilit,
                    allocation: +action.payload.allocation
                  };
                }

                return shopLiabilit;
              });
            }

            return liability;
          });
        }

        return commonAreaLiability;
      });

      return {
        ...state,
        commonAreaLiabilities: commonAreaLiabilities,
        commonAreaShopRelations: relationShipdata
      };
    }

    case occupationAction.UPDATE_LIABILITY_SHOP_SEARCH_TERM: {
      return {
        ...state,
        liabilityShopSearchTerm: action.payload
      };
    }

    case occupationAction.UPDATE_LIABILITY_SHOP_FILTER: {
      return {
        ...state,
        liabilityShopFilter: action.payload
      };
    }

    case occupationAction.UPDATE_LIABLITY_SPLIT: {

      const liability = Object.assign({}, state.commonAreaLiabilities[state.selectedCommonAreaLiabilityIdx]);

      const currentLiability = liability.liabilities.find(l => l.serviceType == state.selectedCommonAreaLiabilityServiceType);

      if (currentLiability.defaultSettings) {
        liability.liabilities = liability.liabilities.map(l => {
          if (l.defaultSettings) {
            const liability = Object.assign({}, l, {splitType: action.payload});
            liability.shopLiabilities = liability.shopLiabilities.map(sp => {
              return Object.assign({}, sp, {allocation: state.shops[sp.shopId].area});
            });

            return liability;
          }

          return l;
        });
      } else {
        liability.liabilities = liability.liabilities.map(l => {
          if (l.serviceType != state.selectedCommonAreaLiabilityServiceType) {
            return l;
          }

          const liability = Object.assign({}, l, {splitType: action.payload});
          liability.shopLiabilities = liability.shopLiabilities.map(sp => {
            return Object.assign({}, sp, {allocation: state.shops[sp.shopId].area});
          });
          return liability;
        });
      }

      const commonAreaLiabilities = [...state.commonAreaLiabilities];
      commonAreaLiabilities[state.selectedCommonAreaLiabilityIdx] = liability;

      return {
        ...state,
        commonAreaLiabilities: commonAreaLiabilities
      };
    }

    case occupationAction.UPDATE_SHOP_LIABLE: {
      const relationShipdata = {...state.commonAreaShopRelations};

      const commonAreaLiabilities = state.commonAreaLiabilities.map((commonAreaLiability, idx) => {
        if (idx == state.selectedCommonAreaLiabilityIdx) {

          const currentLiability = commonAreaLiability.liabilities.find(l => l.serviceType == state.selectedCommonAreaLiabilityServiceType);
          if (currentLiability.defaultSettings) {
            commonAreaLiability.liabilities = commonAreaLiability.liabilities.map((liability, calIdx) => {
              if (liability.defaultSettings) {
                liability.shopLiabilities = liability.shopLiabilities.map(shopLiabilit => {
                  if (shopLiabilit.shopId == action.payload.shopId) {
                    let data = relationShipdata[commonAreaLiability.commonAreaId][action.payload.shopId];

                    data = Object.assign({}, data);
                    data.liabilities[calIdx].isLiable = action.payload.value;
                    relationShipdata[commonAreaLiability.commonAreaId][action.payload.shopId] = data;

                    return {
                      ...shopLiabilit,
                      isLiable: action.payload.value
                    };
                  }

                  return shopLiabilit;
                });
              }

              return liability;
            });
          } else {
            commonAreaLiability.liabilities = commonAreaLiability.liabilities.map((liability, calIdx) => {
              if (liability.serviceType == state.selectedCommonAreaLiabilityServiceType) {
                liability.shopLiabilities = liability.shopLiabilities.map(shopLiabilit => {
                  if (shopLiabilit.shopId == action.payload.shopId) {
                    let data = relationShipdata[commonAreaLiability.commonAreaId][action.payload.shopId];

                    data = Object.assign({}, data);
                    data.liabilities[calIdx].isLiable = action.payload.value;
                    relationShipdata[commonAreaLiability.commonAreaId][action.payload.shopId] = data;

                    return {
                      ...shopLiabilit,
                      isLiable: action.payload.value
                    };
                  }

                  return shopLiabilit;
                });
              }

              return liability;
            });
          }
        }

        return commonAreaLiability;
      });

      return {
        ...state,
        commonAreaLiabilities: commonAreaLiabilities
      };
    }

    case occupationAction.UPDATE_COMMON_AREA_LIABILITY: {
      return {
        ...state,
        commonAreaLiabilities: state.commonAreaLiabilities.map(cal => {
          if (cal.commonAreaId == action.payload.commonAreaId) {
            return action.payload;
          }

          return cal;
        })
      };
    }

    case occupationAction.RESET_FILTERS: {
      return {
        ...state,
        shopSearchTerm: null,
        shopConnectFilter: 0,
        shopStatusFilter: 0,
        commonAreasSearchTerm: null,
        liabilityShopSearchTerm: null,
        liabilityShopFilter: LiableShopStatus.AllShops
      };
    }

    case occupationAction.FULL_RECALC_PROPORTIONS_COMPLETE: {
      return {
        ...state,
        ...action.payload
      };
    }

    case occupationAction.UPDATE_COMMON_SERVICE_LIABILITY: {
      const commonAreaLiabilities = [...state.commonAreaLiabilities];
      const relationData = {...state.commonAreaShopRelations};
      let commonAreaLiability = state.commonAreaLiabilities.find(c => c.commonAreaId === action.payload.commonAreaId);
      const commonAreaLiabilityIdx = state.commonAreaLiabilities.findIndex(c => c.commonAreaId === action.payload.commonAreaId);

      if (!commonAreaLiability) {
        commonAreaLiability = new CommonAreaLiabilityViewModel();
        commonAreaLiability.commonAreaId = action.payload.commonAreaId;
        commonAreaLiability.commonArea = state.commonAreas[action.payload.commonAreaId];
        commonAreaLiability.liabilities = OccupetionStoreEx.initLiabilities(commonAreaLiability.commonArea.services);

        commonAreaLiabilities.push(commonAreaLiability);
      }

      const updateLiability = {};
      updateLiability[action.payload.path] = action.payload.value;

      const currentLiability = commonAreaLiability.liabilities.find(l => l.serviceType == action.payload.serviceType);
      const commonAreaData: Dictionary<CommonAreaShopRelationsViewModel> = Object.assign({}, relationData[action.payload.commonAreaId]);

      const liabilities = [...commonAreaLiability.liabilities];

      if (currentLiability.defaultSettings && action.payload.path !== 'defaultSettings') {
        commonAreaLiability = {
          ...commonAreaLiability,
          liabilities: liabilities.map(l => {
            if (l.defaultSettings) {
              if (action.payload.path === 'splitType') {
                state.shopIds.forEach(shopId => {
                  const liability = commonAreaData[shopId].liabilities.find(sl => sl.serviceType === l.serviceType);
                  if (liability) {
                    liability.allocation = state.shops[shopId].area;
                  }
                });
              }

              return Object.assign({}, l, updateLiability);
            }

            return l;
          })
        };

        commonAreaLiabilities[commonAreaLiabilityIdx] = {
          ...commonAreaLiabilities[commonAreaLiabilityIdx],
          ...commonAreaLiability
        };
      } else {

        if (action.payload.path === 'splitType') {
          state.shopIds.forEach(shopId => {
            const liability = commonAreaData[shopId].liabilities.find(sl => sl.serviceType == action.payload.serviceType);
            if (liability) {
              liability.allocation = state.shops[shopId].area;
            }
          });
        }

        commonAreaLiability = {
          ...commonAreaLiability,
          liabilities: liabilities.map(l => {
            if (l.serviceType !== action.payload.serviceType) {
              return l;
            }

            return Object.assign({}, l, updateLiability);
          })
        };

        commonAreaLiabilities[commonAreaLiabilityIdx] = {
          ...commonAreaLiabilities[commonAreaLiabilityIdx],
          ...commonAreaLiability
        };
      }
      relationData[action.payload.commonAreaId] = commonAreaData;

      return {
        ...state,
        commonAreaLiabilities,
        commonAreaShopRelations: relationData
      };
    }

    case occupationAction.UPDATE_SHOP_ALLOCATION_BY_SERVICE: {
      const relationShipdata = {...state.commonAreaShopRelations};

      const commonAreaLiabilities = state.commonAreaLiabilities.map((commonAreaLiability) => {
        if (commonAreaLiability.commonAreaId === action.payload.commonAreaId) {

          const currentLiability = commonAreaLiability.liabilities.find(l => l.serviceType == action.payload.serviceType);
          if (currentLiability.defaultSettings) {
            commonAreaLiability.liabilities = commonAreaLiability.liabilities.map((liability, calIdx) => {
              if (liability.defaultSettings) {
                liability.shopLiabilities = liability.shopLiabilities.map(shopLiabilit => {
                  if (shopLiabilit.shopId === action.payload.shopId) {
                    let data = relationShipdata[commonAreaLiability.commonAreaId][action.payload.shopId];

                    data = Object.assign({}, data);
                    data.liabilities[calIdx].allocation = action.payload.allocation;
                    relationShipdata[commonAreaLiability.commonAreaId][action.payload.shopId] = data;

                    return {
                      ...shopLiabilit,
                      allocation: +action.payload.allocation
                    };
                  }

                  return shopLiabilit;
                });
              }

              return liability;
            });
          } else {
            commonAreaLiability.liabilities = commonAreaLiability.liabilities.map((liability, calIdx) => {
              if (liability.serviceType === action.payload.serviceType) {
                liability.shopLiabilities = liability.shopLiabilities.map(shopLiabilit => {
                  if (shopLiabilit.shopId === action.payload.shopId) {
                    let data = relationShipdata[commonAreaLiability.commonAreaId][action.payload.shopId];

                    data = Object.assign({}, data);
                    const liability = data.liabilities.find(l => l.serviceType == action.payload.serviceType);
                    if (liability) {
                      liability.allocation = action.payload.allocation;
                    }

                    relationShipdata[commonAreaLiability.commonAreaId][action.payload.shopId] = data;

                    return {
                      ...shopLiabilit,
                      allocation: +action.payload.allocation
                    };
                  }

                  return shopLiabilit;
                });
              }

              return liability;
            });
          }
        }

        return commonAreaLiability;
      });

      return {
        ...state,
        commonAreaLiabilities: commonAreaLiabilities,
        commonAreaShopRelations: relationShipdata
      };
    }

    case occupationAction.UPDATE_SHOP_LIABLE_BY_SERVICE: {
      const relationShipdata = {...state.commonAreaShopRelations};

      const commonAreaLiabilities = state.commonAreaLiabilities.map((commonAreaLiability) => {
        if (commonAreaLiability.commonAreaId === action.payload.commonAreaId) {

          const currentLiability = commonAreaLiability.liabilities.find(l => l.serviceType == action.payload.serviceType);
          if (currentLiability.defaultSettings) {
            commonAreaLiability.liabilities = commonAreaLiability.liabilities.map((liability, calIdx) => {
              if (liability.defaultSettings) {
                liability.shopLiabilities = liability.shopLiabilities.map(shopLiabilit => {
                  if (shopLiabilit.shopId === action.payload.shopId) {
                    let data = relationShipdata[commonAreaLiability.commonAreaId][action.payload.shopId];

                    data = Object.assign({}, data);
                    data.liabilities = data.liabilities.map(dl => {
                      if (dl.serviceType == liability.serviceType) {
                        dl.isLiable = action.payload.value;
                      }

                      return dl;
                    });

                    relationShipdata[commonAreaLiability.commonAreaId][action.payload.shopId] = data;

                    return {
                      ...shopLiabilit,
                      isLiable: action.payload.value
                    };
                  }

                  return shopLiabilit;
                });
              }

              return liability;
            });
          } else {
            commonAreaLiability.liabilities = commonAreaLiability.liabilities.map((liability, calIdx) => {
              if (liability.serviceType === action.payload.serviceType) {
                liability.shopLiabilities = liability.shopLiabilities.map(shopLiabilit => {
                  if (shopLiabilit.shopId === action.payload.shopId) {
                    let data = relationShipdata[commonAreaLiability.commonAreaId][action.payload.shopId];

                    data = Object.assign({}, data);
                    const liability = data.liabilities.find(l => l.serviceType == action.payload.serviceType);
                    if (liability) {
                      liability.isLiable = action.payload.value;
                    }

                    relationShipdata[commonAreaLiability.commonAreaId][action.payload.shopId] = data;

                    return {
                      ...shopLiabilit,
                      isLiable: action.payload.value
                    };
                  }

                  return shopLiabilit;
                });
              }

              return liability;
            });
          }
        }

        return commonAreaLiability;
      });

      return {
        ...state,
        commonAreaLiabilities: commonAreaLiabilities
      };
    }

    case occupationAction.ADD_ALL_COMMON_AREA_SHOP_BY_SHOP: {

      let commonAreaLiabilities = [...state.commonAreaLiabilities];
      const searchTerm = state.commonAreasSearchTerm;

      state.commonAreaIds
        .map(id => state.commonAreas[id])
        .filter(commonArea => {
          let result = commonArea.isActive;

          if (searchTerm && result) {
            result = ((commonArea.name.toLocaleLowerCase().search(searchTerm.toLocaleLowerCase()) + 1) > 0);
          }

          return result;
        })
        .forEach(commonArea => {


          const relation = Object.assign({}, state.commonAreaShopRelations[commonArea.id][action.payload]);
          relation.isSelected = true;

          if (!relation.liabilities.length) {
            const relations = OccupetionStoreEx.initRelations(state.commonAreas[commonArea.id].services);
            relation.liabilities = relation.liabilities.concat(relations);
          }

          relation.liabilities.forEach(rl => {
            rl.allocation = state.shops[action.payload].area;
          });

          state.commonAreaShopRelations[commonArea.id][action.payload] = relation;
          let commonAreaLiability = commonAreaLiabilities.find(cal => cal.commonAreaId == commonArea.id);
          if (commonAreaLiability) {
            commonAreaLiability.liabilities = [...commonAreaLiability.liabilities];
          } else {
            commonAreaLiability = new CommonAreaLiabilityViewModel();
            commonAreaLiability.commonAreaId = commonArea.id;
            commonAreaLiability.liabilities = OccupetionStoreEx.initLiabilities(commonArea.services);
          }

          commonAreaLiability.liabilities.forEach(l => {
            let shopLiability = l.shopLiabilities.find(sl => sl.shopId == action.payload);
            if (!shopLiability) {
              shopLiability = new ShopLiabilityViewModel();
              shopLiability.allocation = state.shops[action.payload].area;
              shopLiability.shop = state.shops[action.payload];
              shopLiability.shopId = action.payload;

              l.shopLiabilities.push(shopLiability);
            }
          });

          commonAreaLiabilities = commonAreaLiabilities.filter(cal => cal.commonAreaId != commonArea.id);
          commonAreaLiabilities.push(commonAreaLiability);

        });

      return {
        ...state,
        commonAreaShopRelations: {...state.commonAreaShopRelations},
        commonAreaLiabilities: commonAreaLiabilities
      };
    }

    case occupationAction.DELETE_ALL_COMMON_AREA_SHOP_BY_SHOP: {

      const commonAreaLiabilities = [...state.commonAreaLiabilities];
      const searchTerm = state.commonAreasSearchTerm;

      state.commonAreaIds
        .map(id => state.commonAreas[id])
        .filter(commonArea => {
          let result = commonArea.isActive;

          if (searchTerm && result) {
            result = (commonArea.name.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1);
          }

          return result;
        })
        .forEach(commonArea => {
          const relation = Object.assign({}, state.commonAreaShopRelations[commonArea.id][action.payload]);
          relation.isSelected = false;

          state.commonAreaShopRelations[commonArea.id][action.payload] = relation;
        });

      return {
        ...state,
        commonAreaShopRelations: {...state.commonAreaShopRelations}
      };
    }

    case occupationAction.ADD_ALL_COMMON_AREA_SHOP_BY_COMMON_AREA: {

      const filter = state.complexLiabilityShopFilter;
      const commonAreas = state.commonAreaIds.map(id => state.commonAreas[id]);
      const commonAreaShopRelations = state.commonAreaShopRelations;
      const searchTerm = state.shopSearchTerm;

      const result = Object.assign({}, state.commonAreaShopRelations[action.payload.commonAreaId]);
      let commonAreaLiability = state.commonAreaLiabilities.find(cal => cal.commonAreaId == action.payload.commonAreaId);
      commonAreaLiability = Object.assign({}, commonAreaLiability);

      if (!commonAreaLiability.liabilities.length) {
        commonAreaLiability.liabilities = OccupetionStoreEx.initLiabilities(state.commonAreas[action.payload.commonAreaId].services);
      }

      state.shopIds.map(id => state.shops[id])
        .filter(shop => {
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
            result = (shop.name.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1) ||
              (shop.tenant && shop.tenant.name.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1);
          }

          return result;
        })
        .forEach(shop => {
          const relation = Object.assign({}, result[shop.id]);
          relation.isSelected = true;

          if (!relation.liabilities.length) {
            relation.liabilities = OccupetionStoreEx.initRelations(state.commonAreas[action.payload.commonAreaId].services);
            relation.liabilities.forEach(l => {
              l.allocation = shop.area;
            });
          }

          commonAreaLiability.liabilities.forEach(liability => {
            let shopLiability = liability.shopLiabilities.find(sl => sl.shopId == shop.id);
            if (!shopLiability) {
              shopLiability = new ShopLiabilityViewModel();
              shopLiability.shopId = shop.id;
              shopLiability.allocation = shop.area;

              liability.shopLiabilities = [...liability.shopLiabilities, shopLiability];
            }
          });

          result[shop.id] = relation;
        });

      return {
        ...state,
        commonAreaShopRelations: {
          ...state.commonAreaShopRelations,
          [action.payload.commonAreaId]: {
            ...result
          }
        },
        commonAreaLiabilities: state.commonAreaLiabilities.map(cal => cal.commonAreaId == commonAreaLiability.commonAreaId ? commonAreaLiability : cal)
      };
    }

    case occupationAction.DELETE_ALL_COMMON_AREA_SHOP_BY_COMMON_AREA: {

      const filter = state.complexLiabilityShopFilter;
      const commonAreas = state.commonAreaIds.map(id => state.commonAreas[id]);
      const commonAreaShopRelations = state.commonAreaShopRelations;
      const searchTerm = state.shopSearchTerm;

      state.shopIds.map(id => state.shops[id])
        .filter(shop => {
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
            result = (shop.name.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1) ||
              (shop.tenant && (shop.tenant.name.toLocaleLowerCase().search(searchTerm.toLocaleLowerCase()) + 1) > 0);
          }

          return result;
        })
        .forEach(shop => {
          const relation = Object.assign({}, state.commonAreaShopRelations[action.payload.commonAreaId][shop.id]);
          relation.isSelected = false;

          state.commonAreaShopRelations[action.payload.commonAreaId][shop.id] = relation;
        });

      return {
        ...state,
        commonAreaShopRelations: {...state.commonAreaShopRelations}
      };
    }

    case occupationAction.RECALC_COMMON_AREA_GROUP_COMPLETE: {

      return {
        ...state,
        commonAreaShopRelations: {...state.commonAreaShopRelations, ...action.payload}
      };
    }

    case occupationAction.RECALC_SHOP_GROUP_COMPLETE: {
      return {
        ...state,
        commonAreaShopRelations: {...state, ...action.payload}
      };
    }

    case occupationAction.UPDATE_COMPLEX_LIABILITY_SHOP_FILTER: {
      return {
        ...state,
        complexLiabilityShopFilter: action.payload
      };
    }

    case occupationAction.UPDATE_COMMENT: {
      return {
        ...state,
        comment: action.payload
      };
    }

    case occupationAction.GET_HISTORY_REQUEST_COMPLETE: {

      const histories = action.payload.reduce((accum, next) => {
        accum[next.id] = next;
        return accum;
      }, {});

      const historyIds = action.payload.map(l => l.id);
      const updateDate = new Date();

      return {
        ...state,
        historyIds: historyIds,
        histories: histories,
        updateDate: updateDate
      };
    }

    case occupationAction.HISTORY_CHANGE: {

      const updateDate = state.histories[action.payload].updateDate;

      return {
        ...state,
        versionId: action.payload,
        updateDate: updateDate
      };
    }

    case occupationAction.UPDATE_DATE: {

      return {
        ...state,
        updateDate: action.payload
      };
    }

    case occupationAction.INIT_LIABILITIES_BY_COMMON_AREA_SERVICES_COMPLETE: {
      return {
        ...state,
        commonAreaLiabilities: action.payload.liabilities,
        commonAreaShopRelations: action.payload.relations
      };
    }

    case occupationAction.UPDATE_COMMON_AREA_SERVICES: {

      const commonAreas = JSON.parse(JSON.stringify(state.commonAreas));
      const services = commonAreas[action.payload.id].services;
      services[action.payload.path] = action.payload.value;
      commonAreas[action.payload.id].services = services;

      return {
        ...state,
        commonAreas: commonAreas
      };
    }

    case occupationAction.UPDATE_SHOP_TENANT_DETAILS: {
      const updateShop = Object.assign({}, state.shops[action.payload.shopId]);

      updateShop['tenant'] = action.payload.newTenantId
        ? state.tenants.find(t => t.id === action.payload.newTenantId)
        : null;

      const shops = {...state.shops};
      shops[action.payload.shopId] = updateShop;

      return {
        ...state,
        shops: shops
      };
    }

    case occupationAction.SELECTED_COMMON_AREA_LIABILITY_BY_ID: {
      let idx = state.commonAreaLiabilities.findIndex(cal => cal.commonAreaId == action.payload);
      let commonAreaLiabilities = state.commonAreaLiabilities;

      if (idx == -1) {
        const commonAreaLiability = new CommonAreaLiabilityViewModel();
        commonAreaLiability.commonAreaId = action.payload;
        commonAreaLiability.commonArea = state.commonAreas[action.payload];
        commonAreaLiability.liabilities = OccupetionStoreEx.initLiabilities(state.commonAreas[action.payload].services);
        commonAreaLiabilities = [...state.commonAreaLiabilities, commonAreaLiability];
        idx = commonAreaLiabilities.length - 1;
      }

      let selectedCommonAreaLiabilityServiceType = 0;

      const services = state.commonAreas[action.payload].services;
      if (services.isElectricityEnable) {
        selectedCommonAreaLiabilityServiceType = SupplyType.Electricity;
      } else if (services.isWaterEnable) {
        selectedCommonAreaLiabilityServiceType = SupplyType.Water;
      } else if (services.isSewerageEnable) {
        selectedCommonAreaLiabilityServiceType = SupplyType.Sewerage;
      } else if (services.isGasEnable) {
        selectedCommonAreaLiabilityServiceType = SupplyType.Gas;
      } else if (services.isOtherEnable) {
        selectedCommonAreaLiabilityServiceType = SupplyType.AdHoc;
      }

      return {
        ...state,
        selectedCommonAreaLiabilityIdx: idx,
        selectedCommonAreaLiabilityServiceType: selectedCommonAreaLiabilityServiceType,
        commonAreaLiabilities: commonAreaLiabilities
      };
    }

    case occupationAction.ADD_TENANT_SUCCESS: {
      let tenants = [...state.tenants, action.payload].sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }

        return 0;
      });

      return {
        ...state,
        tenants: tenants
      };

    }

    case occupationAction.UPDATE_SHOP_ORDER: {
      return {
        ...state,
        shopOrderIndex: action.payload
      };
    }

    case occupationAction.UPDATE_COMMON_AREA_ORDER: {
      return {
        ...state,
        commonAreaOrderIndex: action.payload
      };
    }

    case occupationAction.VERSION_CHANGE: {
      return {
        ...state,
        versionId: action.payload
      };
    }

    case occupationAction.UPDATE_BUILDING_PERIOD: {
      return {
        ...state,
        buildingPeriod: action.payload
      };
    }

    default:
      return state;
  }

}

export const getShops = (state: State) => state.shops;
export const getCommonAreas = (state: State) => state.commonAreas;

export const getTenants = (state: State) => state.tenants;

export const getShopIds = (state: State) => state.shopIds;
export const getCommonAreaIds = (state: State) => state.commonAreaIds;

export const getShopSearchTerm = (state: State) => state.shopSearchTerm;
export const getShopConnectFilter = (state: State) => state.shopConnectFilter;
export const getCommonAreaSearchTerm = (state: State) => state.commonAreasSearchTerm;
export const getCommonAreaLiabilities = (state: State) => state.commonAreaLiabilities;
export const getCommonAreaShopRelations = (state: State) => state.commonAreaShopRelations;
export const getShopStatusFilter = (state: State) => state.shopStatusFilter;

export const getCurrentStep = (state: State) => state.currentStep;
export const getSelectedCommonAreaLiabilityIdx = (state: State) => state.selectedCommonAreaLiabilityIdx;
export const getSelectedCommonAreaLiabilityServiceType = (state: State) => state.selectedCommonAreaLiabilityServiceType;

export const getLiabilityShopSearchTerm = (state: State) => state.liabilityShopSearchTerm;
export const getLiabilityShopFilter = (state: State) => state.liabilityShopFilter;
export const getComplexLiabilityShopFilter = (state: State) => state.complexLiabilityShopFilter;

export const getCompleteStatus = (state: State) => state.isComplete;
export const canEdit = (state: State) => state.canEdit;

export const getHistories = (state: State) => state.histories;
export const getHistoryIds = (state: State) => state.historyIds;
export const getCurrentHistoryId = (state: State) => state.versionId;

export const getUpdateDate = (state: State) => state.updateDate;
export const getComment = (state: State) => state.comment;

export const getShopOrderIndex = (state: State) => state.shopOrderIndex;
export const getCommonAreaOrderIndex = (state: State) => state.commonAreaOrderIndex;
