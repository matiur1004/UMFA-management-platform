import {getBuildingCategories, getTariffState} from './common.selectors';
import {createSelector} from '@ngrx/store';
import {sortRule} from '@shared-helpers';
import {
  AggregatedTariffViewModel,
  CategoryViewModel,
  OrderTariffList,
  TariffViewModel,
  VersionViewModel
} from '@models';


const sortTariffs = (tariffs: AggregatedTariffViewModel[], order: number) => {
  tariffs = [...tariffs];
  switch (order) {
    case OrderTariffList.NameAsc:
      return tariffs.sort((a, b) => sortRule(a.name, b.name));
    case OrderTariffList.NameDesc:
      return tariffs.sort((a, b) => sortRule(b.name, a.name));
    case OrderTariffList.VersionAsc:
      tariffs.forEach(item => {
        item.tariffs.sort((a, b) => sortRule(a.majorVersion, b.majorVersion));
      });
      return tariffs;
    case OrderTariffList.VersionDesc:
      tariffs.forEach(item => {
        item.tariffs.sort((a, b) => sortRule(b.majorVersion, a.majorVersion));
      });
      return tariffs;
  }
};


const aggregateTariffs = (buildingCategories: CategoryViewModel[], tariffs: VersionViewModel<TariffViewModel>[]) => {

  let aggregatedTariffsDictionary = {};
  let aggregatedTariffs = [];

  tariffs.forEach((item) => {
    if (aggregatedTariffsDictionary[item.entity.id]) {
      aggregatedTariffsDictionary[item.entity.id].push(item);
    } else {
      aggregatedTariffsDictionary[item.entity.id] = [item];
    }
  })

  for (var key in aggregatedTariffsDictionary) {
    if (!aggregatedTariffsDictionary.hasOwnProperty(key)) {
      continue;
    }
    let aggregatedTariff = new AggregatedTariffViewModel();
    aggregatedTariff.tariffs = aggregatedTariffsDictionary[key];

    let lastTariff = aggregatedTariff.tariffs.reduce((prev, current) => (prev.majorVersion > current.majorVersion) ? prev : current);
    let firstTariff = aggregatedTariff.tariffs.reduce((prev, current) => (prev.majorVersion < current.majorVersion) ? prev : current);

    aggregatedTariff.id = lastTariff.id;
    aggregatedTariff.name = lastTariff.entity.name;
    aggregatedTariff.code = lastTariff.entity.code;
    aggregatedTariff.supplyType = lastTariff.entity.supplyType;
    aggregatedTariff.tariffCategories = lastTariff.entity.tariffCategories;
    aggregatedTariff.createdOn = new Date(firstTariff.entity.createdOn);
    aggregatedTariff.createdByUser = firstTariff.entity.createdByUser;
    buildingCategories.forEach(item => {
      if (lastTariff.entity.buildingCategoriesIds && lastTariff.entity.buildingCategoriesIds.find(id => id == item.id)) {
        aggregatedTariff.buildingCategories.push(item);
      }
    });

    aggregatedTariffs.push(aggregatedTariff);
  }

  return aggregatedTariffs;
};

export const getTariffs = createSelector(
  getTariffState,
  state => state.tariffs
);

export const getAggregatedTariffs = createSelector(
  getTariffs,
  getBuildingCategories,
  (tariffs, categories) => aggregateTariffs(categories, tariffs)
);

export const getTariffSearchKey = createSelector(
  getTariffState,
  state => state.searchKey
);

export const getTariffOrder = createSelector(
  getTariffState,
  state => state.order
);

export const getTariffVersionOrder = createSelector(
  getTariffState,
  state => state.versionOrder
);

export const getSortedTariffs = createSelector(
  getAggregatedTariffs,
  getTariffOrder,
  getTariffVersionOrder,
  (tariffs, order, versionOrder) => {
    let sortedTariffs = sortTariffs(tariffs, order);
    sortedTariffs = sortTariffs(sortedTariffs, versionOrder);

    return sortedTariffs;
  }
);

export const getTariffSupplyTypeFilter = createSelector(
  getTariffState,
  state => state.supplyTypeFilter
);

export const getTariffBuildingCategoryId = createSelector(
  getTariffState,
  state => state.buildingCategoryId
);

export const getBuildingCategoriesDict = createSelector(
  getBuildingCategories,
  categories => categories.reduce((a, c) => {
    a[c.id] = c;
    return a;
  }, {})
);

export const getTariffBuildingCategoryFilter = createSelector(
  getBuildingCategoriesDict,
  getTariffBuildingCategoryId,
  (categories, id) => {
    return categories[id];
  }
);

export const getTariffVersionId = createSelector(
  getTariffState,
  state => state.tariffVersionId
);
