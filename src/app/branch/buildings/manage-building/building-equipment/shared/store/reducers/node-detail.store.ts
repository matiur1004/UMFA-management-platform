import * as nodeFormActions from '../actions/node-form.actions';
import * as nodeActions from '../actions/node.actions';
import {
  ChildNodeAssignmentViewModel,
  ConsumptionCostNodeInfo,
  NodeAttributeValueViewModel,
  NodeDetailViewModel
} from '../../models';
import {TariffViewModel, VersionViewModel} from '@models';

export interface State {
  nodeDetail: NodeDetailViewModel;
  attributes: NodeAttributeValueViewModel[];
  allowedChildrenNodes: ChildNodeAssignmentViewModel[];
  showNodesAllocation: boolean;
  tariffs: VersionViewModel<TariffViewModel>[];
  activeTab: string;
}

export const initialState: State = {
  nodeDetail: null,
  attributes: null,
  showNodesAllocation: false,
  allowedChildrenNodes: null,
  tariffs: [],
  activeTab: 'equipment'
};

export function reducer(state = initialState, action: nodeFormActions.Action | nodeActions.Action) {
  switch (action.type) {
    case nodeActions.SET_NODE_DETAIL: {
      const node = action.payload.node;
      const costSplitRegister = action.payload.costSplitRegister;
      const nodeChanged = !state.nodeDetail || state.nodeDetail.id !== node.id;
      if (!node.costProvider) {
        const defaultFactorValue = 1;
        node.costProvider = {
          costFactor: defaultFactorValue,
          registerId: costSplitRegister,
          isActive: false
        };
      } else if (node.costProvider) {
        node.costProvider.isActive = true;
      }
      let result = {
        ...state,
        nodeDetail: node,
        attributes: node.attributeValues
      };
      if (nodeChanged) {
        result.allowedChildrenNodes = null;
      }
      return result;
    }

    case nodeActions.CHANGE_NODE_SPLIT_TYPE: {
      const {splitType, allocatedUnits} = action.payload;

      return {...state, nodeDetail: {...state.nodeDetail, splitType: splitType, allocatedUnits: allocatedUnits}};
    }

    case nodeActions.TOGGLE_NODE_INFO: {
      const nodeDetail = {...state.nodeDetail};
      const allocatedUnits = [...nodeDetail.allocatedUnits];
      const unitId = allocatedUnits.findIndex(u => u.id === action.payload);
      allocatedUnits[unitId] = {
        ...allocatedUnits[unitId],
        showNodeInfo: !allocatedUnits[unitId].showNodeInfo
      };

      return {
        ...state,
        nodeDetail: {
          ...nodeDetail,
          allocatedUnits: allocatedUnits
        }
      };
    }

    case nodeActions.ADD_REGISTERS_TO_UNITS: {
      const payload = action.payload;
      const allocatedUnits = [...state.nodeDetail.allocatedUnits];
      for (const item of payload) {
        const unit = allocatedUnits.find(u => u.id === item.unitId);

        if (unit) {
          const consumptionCostNodeInfo: ConsumptionCostNodeInfo[] = [];

          for (const nodeInfo of item.nodesInfo) {
            const unitNodesInfo = nodeInfo.registers.map(r => ({
              id: nodeInfo.id,
              name: nodeInfo.name,
              unitId: unit.id,
              registerId: r.id
            }));

            consumptionCostNodeInfo.push(...unitNodesInfo);
          }

          unit.consumptionCostNodeInfo = consumptionCostNodeInfo;
        }
      }

      const nodeDetail = {
        ...state.nodeDetail,
        allocatedUnits
      };

      return {
        ...state,
        nodeDetail
      };
    }

    case nodeActions.OPEN_TAB: {
      return {
        ...state,
        activeTab: action.payload.tab
      };
    }

    case nodeActions.GET_NODE_ALLOWED_CHILDREN_SUCCESS: {
      return {
        ...state,
        allowedChildrenNodes: action.payload.nodes
      };
    }

    case nodeActions.TOGGLE_ADD_CHILD_NODES_DISPLAY: {
      return {
        ...state,
        showNodesAllocation: action.payload.show
      };
    }

    case nodeFormActions.SET_TARIFFS: {
      return {
        ...state,
        tariffs: action.payload
      };
    }

    case nodeFormActions.SET_NODE_ATTRIBUTES: {
      return {
        ...state,
        attributes: action.payload
      };
    }

    case nodeFormActions.SET_RECOMMENDED_TARIFFS: {
      return {
        ...state,
        tariffs: action.payload
      };
    }

    default:
      return state;
  }
}

export const getNodeDetail = (state: State) => state.nodeDetail;
export const getNodeAttributes = (state: State) => state.attributes;
export const getAllowedChildrenNodes = (state: State) => state.allowedChildrenNodes;
export const getShowNodesAllocation = (state: State) => state.showNodesAllocation;
export const getTariffs = (state: State) => state.tariffs;
export const getActiveTab = (state: State) => state.activeTab;
