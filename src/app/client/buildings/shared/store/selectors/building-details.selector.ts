import {createSelector} from '@ngrx/store';

import {getBuildingState} from '../reducers';
import * as building from '../reducers/building-details.store';
import {ShopStatus} from '@models';

export const getBuilding = createSelector(
  getBuildingState,
  building.getBuilding
);

const _getShops = createSelector(
  getBuilding,
  building => building ? building.shops : []
);

const _getSearchKey = createSelector(
  getBuildingState,
  building.getSearchKey
);

const _getTenantId = createSelector(
  getBuildingState,
  building.getTenantId
);

export const getStatus = createSelector(
  getBuildingState,
  building.getStatus
);

const _getTenants = createSelector(
  _getShops,
  shops => {
    const tenants = {};
    shops.forEach(item => {
      if (item.tenant) {
        tenants[item.tenant.id] = {
          id: item.tenant.id,
          name: item.tenant.name
        };
      }
    });

    return tenants;
  }
);

export const getTenants = createSelector(
  _getTenants,
  tenants => {
    const tenantIds = Object.keys(tenants);
    return tenantIds.map(id => tenants[id]);
  }
);

export const getSelectedTenant = createSelector(
  _getTenants,
  _getTenantId,
  (tenants, tenantId) => tenants[tenantId]
);

export const getFloors = createSelector(
  _getShops,
  shops => {
    const floors = shops.map(s => s.floor);
    return Array.from(new Set(floors));
  }
);

export const getFloor = createSelector(
  getBuildingState,
  building.getFloor
);

export const getShops = createSelector(
  _getShops,
  _getSearchKey,
  _getTenantId,
  getStatus,
  getFloor,
  (shops, searchKey, tenantId, status, floor) => {
    if (tenantId) {
      shops = shops.filter(s => s.tenant && s.tenant.id === tenantId);
    }

    if (floor !== null) {
      shops = shops.filter(s => s.floor === floor);
    }

    if (status !== null) {
      switch (status) {
        case ShopStatus.Spare:
          shops = shops.filter(s => s.isSpare);
          break;

        case ShopStatus.Vacant:
          shops = shops.filter(s => !s.tenant);
          break;

        case ShopStatus.Occupied:
          shops = shops.filter(s => s.tenant);
      }

    }

    if (searchKey) {
      shops = shops.filter(s => !!s.name.match(new RegExp(searchKey.trim(), 'i')));
    }

    return shops;
  }
);





