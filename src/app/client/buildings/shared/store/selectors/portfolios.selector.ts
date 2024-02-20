import {createSelector} from '@ngrx/store';

import {getPortfoliosState} from '../reducers';
import * as portfolios from '../reducers/portfolio.store';

export const getPortfolios = createSelector(
  getPortfoliosState,
  portfolios.getPortfolios
);

export const getTotalNumberOfBuildings = createSelector(
  getPortfolios,
  portfolios => portfolios.reduce((acc, curr) => {
    return acc + curr.totalBuildings;
  }, 0)
);
