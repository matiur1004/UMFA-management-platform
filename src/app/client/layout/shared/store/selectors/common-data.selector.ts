import {createSelector} from '@ngrx/store';

import {getCommonDataState} from '../reducers'
import * as commonData from '../reducers/common-data.store';

export const getClientId = createSelector(
  getCommonDataState,
  commonData.getClientId
);
