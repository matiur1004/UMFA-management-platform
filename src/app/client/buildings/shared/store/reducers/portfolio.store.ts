import {PortfolioViewModel} from '../../models/buildings.model';

import * as portfolioActions from '../actions/portfolio.actions';

export interface State {
  portfolios: PortfolioViewModel[]
}

export const initialState: State = {
  portfolios: []
};

export function reducer(state = initialState, action: portfolioActions.Actions) {
  switch (action.type) {
    case portfolioActions.CLIENT_PORTFOLIO_LIST_REQUEST_COMPLETE: {
      return {
        ...state,
        portfolios: action.payload
      };
    }

    case portfolioActions.UPDATE_IS_TOGGLE: {

      const portfolios = [...state.portfolios];

      portfolios.splice(action.payload, 1, {
        ...portfolios[action.payload],
        isSelected: !portfolios[action.payload].isSelected
      });

      return {
        ...state,
        portfolios: portfolios
      };
    }

    case portfolioActions.SET_PORTFOLIO: {

      const portfolios = [...state.portfolios];

      portfolios.splice(action.payload.index, 1, action.payload.portfolio);

      return {
        ...state,
        portfolios: portfolios
      };
    }

    default:
      return state;
  }
}

export const getPortfolios = (state: State) => state.portfolios;
