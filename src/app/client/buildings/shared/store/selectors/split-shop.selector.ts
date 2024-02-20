import {createSelector} from '@ngrx/store';

import {getSplitShopFormState} from '../reducers';
import * as splitShop from '../reducers/split-shop-form.store';

export const getSplitShopForm = createSelector(
  getSplitShopFormState,
  state => state.formState
);

export const getShop = createSelector(
  getSplitShopFormState,
  splitShop.getShop
);
