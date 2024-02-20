import * as nodeFormAllocatedTariffActions from '../actions/node-form-allocated-tariffs.actions';
import {AllocatedTariffDetailViewModel} from '../../models/node-allocated-tariff.model';

export interface State {
  tariffs: AllocatedTariffDetailViewModel[];
  recommendedTariffs: any;
}

export const initialState: State = {
  tariffs: [],
  recommendedTariffs: {}
}

export function reducer(state = initialState, action: nodeFormAllocatedTariffActions.Action) {
  switch (action.type) {

    case nodeFormAllocatedTariffActions.SET_NODE_TARIFFS: {
      return {
        ...state,
        tariffs: action.payload
      };
    }

    case nodeFormAllocatedTariffActions.SET_NODE_RECOMMENDED_TARIFFS: {
      return {
        ...state,
        recommendedTariffs: action.payload
      };
    }

    case nodeFormAllocatedTariffActions.DELETE_TARIFF: {
      return {
        ...state,
        tariffs: [...state.tariffs.filter(t => t.id != action.payload)]
      }
    }

    case nodeFormAllocatedTariffActions.UPDATE_TARIFF_IS_BILLING: {
      let tariffs = [...state.tariffs];
      const isBilling = action.payload.isBilling;
      const tariffId = action.payload.tariffId;

      //Check if we try to move last billing tariff to read-only
      if (!isBilling) {
        const countBillingTariffs = tariffs.filter(el => el.isBilling).length;
        if (countBillingTariffs === 1) {
          return {...state, tariffs: tariffs};
        }
      }

      for (let idx = 0; idx < tariffs.length; idx++) {

        let lineItems = [...tariffs[idx].lineItems];

        if (tariffs[idx].id == tariffId) {

          for (let lineItemIdx = 0; lineItemIdx < lineItems.length; lineItemIdx++) {
            lineItems.splice(lineItemIdx, 1, {...lineItems[lineItemIdx], isBilling: isBilling});
          }

          tariffs.splice(idx, 1, {...tariffs[idx], isBilling: isBilling, lineItems: lineItems});
        }
      }

      return {...state, tariffs: tariffs};
    }

    case nodeFormAllocatedTariffActions.UPDATE_LINE_ITEM_IS_BILLING: {
      let tariffs = [...state.tariffs];
      let tariffIndex = tariffs.findIndex(t => t.id == action.payload.id);
      let lineItems = [...tariffs[tariffIndex].lineItems];
      let lineItemIndex = lineItems.findIndex(l => l.id == action.payload.lineItemId);

      lineItems.splice(lineItemIndex, 1, {...lineItems[lineItemIndex], isBilling: action.payload.isBilling});
      tariffs.splice(tariffIndex, 1, {...tariffs[tariffIndex], lineItems: lineItems});

      return {...state, tariffs: tariffs}
    }

    case nodeFormAllocatedTariffActions.UPDATE_LINE_ITEM_IS_ACTIVE: {
      let tariffs = [...state.tariffs];
      let tariffIndex = tariffs.findIndex(t => t.id == action.payload.id);
      let lineItems = [...tariffs[tariffIndex].lineItems];
      let lineItemIndex = lineItems.findIndex(l => l.id == action.payload.lineItemId);

      let filteredLineItems = lineItems.filter(l => l.isActive && l.id != action.payload.lineItemId);
      if (filteredLineItems.length == 1 && tariffs[tariffIndex].isBilling) {
        let filteredLineItemIndex = lineItems.findIndex(l => l.id == filteredLineItems[0].id);
        lineItems.splice(filteredLineItemIndex, 1, {...lineItems[filteredLineItemIndex], isBilling: true});
      }

      lineItems.splice(lineItemIndex, 1, {...lineItems[lineItemIndex], isActive: action.payload.isActive});
      tariffs.splice(tariffIndex, 1, {...tariffs[tariffIndex], lineItems: lineItems});

      return {...state, tariffs: tariffs}
    }

    case nodeFormAllocatedTariffActions.UPDATE_LINE_ITEM_CATEGORY: {
      let tariffs = [...state.tariffs];
      let tariffIndex = tariffs.findIndex(t => t.id == action.payload.id);
      let lineItems = [...tariffs[tariffIndex].lineItems];
      let lineItemIndex = lineItems.findIndex(l => l.id == action.payload.lineItemId);

      lineItems.splice(lineItemIndex, 1, {...lineItems[lineItemIndex], categoryId: action.payload.categoryId});
      tariffs.splice(tariffIndex, 1, {...tariffs[tariffIndex], lineItems: lineItems});

      return {...state, tariffs: tariffs}
    }

    default:
      return state;
  }
}

export const getTariffs = (state: State) => state.tariffs;
export const getRecommendedTariffs = (state: State) => state.recommendedTariffs;
