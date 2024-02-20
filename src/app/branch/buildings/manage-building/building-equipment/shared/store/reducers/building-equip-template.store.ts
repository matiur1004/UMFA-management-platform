import {BuildingEquipTemplateFilterDetailViewModel} from "../../models";

import * as equipmentTemplateActions from '../actions/building-equip-template.action';
import {
  BrandViewModel,
  EquipmentAttributeViewModel,
  EquipmentGroupViewModel,
  EquipmentTemplateAttributeViewModel,
  EquipmentTemplateListItemViewModel,
  FieldType,
  SupplyType,
  SupplyTypeCheck
} from '@models';

export interface State {
  equipmentTemplates: EquipmentTemplateListItemViewModel[];
  searchKey: string;
  total: number;
  order: number;
  page: number;
  unitsPerPage: number | null;
  assignFilter: number;

  allEquipmentGroups: EquipmentGroupViewModel[];
  allBrands: BrandViewModel[];
  allEquipmentAttributes: EquipmentAttributeViewModel[];
  allEquipmentTemplateAttributes: EquipmentTemplateAttributeViewModel[];
  allEquipmentTemplateModels: string[];

  filterDetail: BuildingEquipTemplateFilterDetailViewModel;
}

export const initialState: State = {
  equipmentTemplates: [],
  searchKey: '',
  total: 0,
  order: 1,
  page: 1,
  unitsPerPage: 30,
  assignFilter: -1,

  allEquipmentGroups: [],
  allBrands: [],
  allEquipmentAttributes: [],
  allEquipmentTemplateAttributes: [],
  allEquipmentTemplateModels: [],

  filterDetail: new BuildingEquipTemplateFilterDetailViewModel()
};

export function reducer(state = initialState, action: equipmentTemplateActions.Action) {
  switch (action.type) {

    case equipmentTemplateActions.REQUEST_EQUIPMENT_TEMPLATE_COMPLETE: {
      return {
        ...state,
        equipmentTemplates: action.payload.items,
        total: action.payload.total
      };
    }

    case equipmentTemplateActions.UPDATE_ORDER: {
      return {
        ...state,
        order: action.payload
      };
    }

    case equipmentTemplateActions.UPDATE_SEARCH_KEY: {
      return {
        ...state,
        searchKey: action.payload,
        page: 1
      };
    }

    case equipmentTemplateActions.UPDATE_PAGE: {
      return {
        ...state,
        page: action.payload
      };
    }

    case equipmentTemplateActions.UPDATE_UNITS_PER_PAGE: {
      return {
        ...state,
        unitsPerPage: action.payload
      };
    }

    case equipmentTemplateActions.UPDATE_IS_ASSIGNED_FILTER: {
      return {
        ...state,
        assignFilter: action.payload
      };
    }

    case equipmentTemplateActions.INIT_FILTER_DATA_COMPLETE: {
      return {
        ...state,
        allEquipmentGroups: action.payload.equipmentGroups,
        allBrands: action.payload.brands,
        allEquipmentAttributes: action.payload.equipmentAttributes,
        allEquipmentTemplateAttributes: action.payload.equipmentTemplateAttributes,
        allEquipmentTemplateModels: action.payload.equipmentTemplateModels
      };
    }

    case equipmentTemplateActions.INIT_FILTER_DETAIL: {
      let supplyTypes = new Array<SupplyTypeCheck>();
      let initNew = !action.payload;
      supplyTypes = [{supplyType: SupplyType.Electricity, isChecked: initNew || action.payload.hasElectricitySupplier},
        {supplyType: SupplyType.Water, isChecked: initNew || action.payload.hasWaterSupplier},
        {supplyType: SupplyType.Gas, isChecked: initNew || action.payload.hasGasSupplier},
        {supplyType: SupplyType.Sewerage, isChecked: initNew || action.payload.hasSewerageSupplier},
        {supplyType: SupplyType.AdHoc, isChecked: initNew || action.payload.hasAdHocSupplier}];

      let filterDetail = Object.assign(new BuildingEquipTemplateFilterDetailViewModel(),
        {supplyTypes: supplyTypes}, {isAllSupplyTypes: !supplyTypes.find(s => !s.isChecked)}
      );

      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case equipmentTemplateActions.UPDATE_SUPPLY_TYPE: {
      let filterDetail = Object.assign({}, state.filterDetail);
      filterDetail.supplyTypes = state.filterDetail.supplyTypes.map((item, index) => {
        if (index != action.payload.idx)
          return item;
        else
          return {...item, isChecked: !action.payload.isChecked};
      });
      filterDetail.isAllSupplyTypes = !filterDetail.supplyTypes.find(s => !s.isChecked);
      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case equipmentTemplateActions.UPDATE_IS_OLD_MODEL: {
      let filterDetail = Object.assign({}, state.filterDetail);
      filterDetail.isOldModel = !filterDetail.isOldModel;
      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case equipmentTemplateActions.UPDATE_ALL_SUPPLY_TYPES: {
      let filterDetail = Object.assign({}, state.filterDetail);
      filterDetail.isAllSupplyTypes = !filterDetail.isAllSupplyTypes;
      if (filterDetail.isAllSupplyTypes) {
        filterDetail.supplyTypes = state.filterDetail.supplyTypes.map(s => ({...s, isChecked: true}));
      } else {
        filterDetail.supplyTypes = state.filterDetail.supplyTypes.map(s => ({...s, isChecked: false}));
      }
      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case equipmentTemplateActions.UPDATE_BRAND: {
      let filterDetail = Object.assign({}, state.filterDetail);
      filterDetail.checkedBrand = action.payload;
      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case equipmentTemplateActions.UPDATE_EQUIPMENT_GROUP: {
      let filterDetail = Object.assign({}, state.filterDetail);
      filterDetail.checkedEquipmentGroup = action.payload;
      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case equipmentTemplateActions.UPDATE_MODEL: {
      let filterDetail = Object.assign({}, state.filterDetail);
      filterDetail.checkedModel = action.payload;
      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case equipmentTemplateActions.UPDATE_ATTRIBUTE: {
      let filterDetail = Object.assign({}, state.filterDetail);
      filterDetail.equipmentAttributes = state.filterDetail.equipmentAttributes.map(a => {
        if (a.attribute.id == action.payload.attribute.id) {
          if (a.attribute.fieldType === FieldType.Number) {
            return {...a, numberValue: action.payload.value};

          } else {
            return {...a, value: action.payload.value};
          }
        } else
          return a;
      });
      return {
        ...state,
        filterDetail: filterDetail
      };
    }

    case equipmentTemplateActions.UPDATE_FILTER_COMPLETE: {
      return {
        ...state,
        filterDetail: action.payload,
        page: 1
      };
    }

    case equipmentTemplateActions.RESET_FILTER: {
      let filterDetail = Object.assign({}, state.filterDetail);

      filterDetail.isAllSupplyTypes = true;

      filterDetail.supplyTypes = state.filterDetail.supplyTypes.map(s => {
        if (!s.isChecked) {
          return {...s, isChecked: true};
        } else
          return s;
      });

      filterDetail.checkedBrand = null;
      filterDetail.checkedEquipmentGroup = null;
      filterDetail.checkedModel = null;
      filterDetail.isOldModel = true;
      filterDetail.equipmentAttributes = state.filterDetail.equipmentAttributes.map(a => {
        a.value = '';
        a.numberValue = '';
        return a;
      });

      return {
        ...state,
        filterDetail: filterDetail,
        page: 1
      };
    }

    case equipmentTemplateActions.RESET_FORM: {
      return {
        ...state,
        searchKey: '',
        total: 0,
        order: 1,
        page: 1,
        unitsPerPage: 30,
        assignFilter: -1,

        allEquipmentGroups: [],
        allBrands: [],
        allEquipmentAttributes: [],
        allEquipmentTemplateAttributes: [],
        allEquipmentTemplateModels: [],

        filterDetail: new BuildingEquipTemplateFilterDetailViewModel()
      };
    }

    default:
      return state;
  }
}

export const getEquipmentTemplates = (state: State) => state.equipmentTemplates;
export const getTotal = (state: State) => state.total;
export const getSearchKey = (state: State) => state.searchKey;
export const getOrder = (state: State) => state.order;
export const getUnitsPerPage = (state: State) => state.unitsPerPage;
export const getPage = (state: State) => state.page;
export const getAssignFilter = (state: State) => state.assignFilter;
export const getFilterDetail = (state: State) => state.filterDetail;
export const getAllEquipmentTemplateModels = (state: State) => state.allEquipmentTemplateModels;
