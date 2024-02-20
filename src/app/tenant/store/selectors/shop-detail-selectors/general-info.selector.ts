import {createSelector} from '@ngrx/store';

import {getShopGeneralInfoState} from '../../reducers';
import * as shopGeneralInfo from '../../reducers/shop-detail-reducers/general-info.store';

export const getGeneralInfo = createSelector(
  getShopGeneralInfoState,
  shopGeneralInfo.getGeneralInfo
);

export const getShopId = createSelector(
  getShopGeneralInfoState,
  shopGeneralInfo.getShopId
);

export const getBuildingId = createSelector(
  getShopGeneralInfoState,
  shopGeneralInfo.getBuildingId
);
