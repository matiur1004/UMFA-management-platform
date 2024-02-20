import {createSelector} from '@ngrx/store';

import {getShopCostsState} from '../../reducers';
import * as shopCosts from '../../reducers/shop-detail-reducers/costs.store';

export const getCosts = createSelector(
  getShopCostsState,
  shopCosts.getCosts
);
