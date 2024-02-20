import {createSelector} from '@ngrx/store';

import * as profiles from '../reducers/profiles.reducer';
import {getProfilesState} from '../../../store/reducers';


const _getTenantBuildings = createSelector(
  getProfilesState,
  profiles.getTenantBuildings
);

const _getSearchKey = createSelector(
  getProfilesState,
  profiles.getSearchKey
);

const _getBuildingId = createSelector(
  getProfilesState,
  profiles.getBuildingId
);

const _getBuildings = createSelector(
  _getTenantBuildings,
  (tenantBuildings) => {
    const buildings = {};
    tenantBuildings.forEach(item => {
      buildings[item.buildingId] = {
        id: item.buildingId,
        name: item.buildingName
      };
    });

    return buildings;
  }
);

export const getBuildings = createSelector(
  _getBuildings,
  (buildings) => {
    const buildingIds = Object.keys(buildings);
    return buildingIds.map(id => buildings[id]);
  }
);

export const getSelectedBuilding = createSelector(
  _getBuildings,
  _getBuildingId,
  (buildings, buildingId) => buildings[buildingId]
);

export const getTenantBuildings = createSelector(
  _getTenantBuildings,
  _getSearchKey,
  _getBuildingId,
  (tenantBuildings, searchKey, buildingId) => {
    if (buildingId) {
      tenantBuildings = [tenantBuildings.find(tb => tb.buildingId === buildingId)];
    }

    if (searchKey) {
      tenantBuildings = tenantBuildings.map(tb => {
        return {
          ...tb,
          tenants: tb.tenants.map(t => {
            return {
              ...t,
              shops: t.shops.filter(s => !!s.shopName.match(new RegExp(searchKey.trim(), 'i')))
            };
          })
        };
      });
    }

    return tenantBuildings;
  }
);

