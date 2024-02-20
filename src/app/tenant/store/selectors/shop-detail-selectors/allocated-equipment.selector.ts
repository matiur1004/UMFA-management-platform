import {createSelector} from '@ngrx/store';

import {getShopAllocatedEquipmentState} from '../../reducers';
import * as shopAllocatedEquipment from '../../reducers/shop-detail-reducers/allocated-equipment.store';

export const getAllocatedEquipment = createSelector(
  getShopAllocatedEquipmentState,
  shopAllocatedEquipment.getAllocatedEquipment
);
