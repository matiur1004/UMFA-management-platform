import * as replaceNodeTariffActions
  from '../../actions/replace-equipment-wizard-actions/replace-node-tariff-step.actions';
import {ReplaceMeterNodeViewModel} from '../../../models/replace-meter-node.model';
import {TariffViewModel, VersionViewModel} from '@models';


export interface State {
  nodes: ReplaceMeterNodeViewModel[];
  tariffs: VersionViewModel<TariffViewModel>[];
}

export const initialState: State = {
  nodes: [],
  tariffs: []
};

export function reducer(state = initialState, action: replaceNodeTariffActions.Action) {
  switch (action.type) {
    case replaceNodeTariffActions.GET_NODE_REQUEST_COMPLETE: {
      return {
        ...state,
        nodes: action.payload
      };
    }

    case replaceNodeTariffActions.GET_TARIFFS_REQUEST_COMPLETE: {
      return {
        ...state,
        tariffs: action.payload
      };
    }

    case replaceNodeTariffActions.UPDATE_TARIFF: {
      const {tariffVersionId, nodeId} = action.payload;
      const tariff = state.tariffs.find(t => t.id === tariffVersionId);
      const nodeTariff = {
        id: tariff.id,
        name: tariff.entity.name,
        duplicationFactor: 1,
        isBilling: true,
        lineItems: tariff.entity.lineItems.map(li => {
          return {
            id: li.id,
            name: li.name,
            isActive: true,
            isBilling: true,
            categoryId: li.categories.length ? li.categories[0].id : null,
            categoryName: li.categories.length ? li.categories[0].name : null,
            categories: li.categories
          };
        })
      };

      const nodes = [...state.nodes];
      const index = nodes.findIndex(n => n.id === nodeId);
      nodes.splice(index, 1, {...nodes[index], tariff: nodeTariff});
      return {
        ...state,
        nodes: nodes
      };
    }

    case replaceNodeTariffActions.TOGGLE_LINE_ITEM_IS_ACTIVE: {
      const {nodeId, lineItemId} = action.payload;
      const nodes = [...state.nodes];
      const nodeIndex = nodes.findIndex(n => n.id === nodeId);
      const node = {...nodes[nodeIndex]};
      const lineItemIndex = node.tariff.lineItems.findIndex(li => li.id === lineItemId);
      const lineItems = [...node.tariff.lineItems];
      lineItems.splice(lineItemIndex, 1, {...lineItems[lineItemIndex], isActive: !lineItems[lineItemIndex].isActive});
      nodes.splice(nodeIndex, 1, {...nodes[nodeIndex], tariff: {...nodes[nodeIndex].tariff, lineItems: lineItems}});

      return {
        ...state,
        nodes: nodes
      };
    }

    case replaceNodeTariffActions.UPDATE_LINE_ITEM_CATEGORY: {
      const {nodeId, lineItemId, categoryId, categoryName} = action.payload;
      const nodes = [...state.nodes];
      const nodeIndex = nodes.findIndex(n => n.id === nodeId);
      const node = {...nodes[nodeIndex]};
      const lineItemIndex = node.tariff.lineItems.findIndex(li => li.id === lineItemId);
      const lineItems = [...node.tariff.lineItems];
      lineItems.splice(lineItemIndex, 1, {
        ...lineItems[lineItemIndex],
        categoryId: categoryId,
        categoryName: categoryName
      });
      nodes.splice(nodeIndex, 1, {...nodes[nodeIndex], tariff: {...nodes[nodeIndex].tariff, lineItems: lineItems}});

      return {
        ...state,
        nodes: nodes
      };
    }

    case replaceNodeTariffActions.RESET_STATE: {
      return {
        ...initialState
      };
    }

    default:
      return state;
  }
}

export const getNodes = (state: State) => state.nodes;
export const getTariffs = (state: State) => state.tariffs;
