import {getReplaceNodeTariffStepState} from '../../reducers';
import * as replaceNodeTariffStepState
  from '../../reducers/replace-equipment-wizard-reducers/replace-node-tariff-step.store';
import {createSelector} from '@ngrx/store';
import {TariffViewModel, VersionViewModel} from '@models';


const getTariff = (tariff: VersionViewModel<TariffViewModel>) => {
  return {
    id: tariff.id,
    name: tariff.entity.name,
    versionData: tariff.versionDate,
    majorVersion: tariff.majorVersion
  };
};

export const _getNodes = createSelector(
  getReplaceNodeTariffStepState,
  replaceNodeTariffStepState.getNodes
);

export const _getTariffs = createSelector(
  getReplaceNodeTariffStepState,
  replaceNodeTariffStepState.getTariffs
);

export const getNodes = createSelector(
  _getNodes,
  _getTariffs,
  (nodes, tariffs) => {
    return nodes.map(node => {
      const tariff = node.tariff && tariffs.length ? tariffs.find(t => t.id === node.tariff.id) : null;
      return {
        ...node,
        tariff: node.tariff && tariff ? {
          ...node.tariff,
          name: tariff.entity.name,
          versionDate: tariff.versionDate,
          majorVersion: tariff.majorVersion,
          lineItems: node.tariff.lineItems.map(li => {
            const lineItem = tariff.entity.lineItems.find(lItem => lItem.id === li.id);
            return {
              ...li,
              name: lineItem.name,
              isBilling: true,
              categoryName: li.categoryId ? lineItem.categories.find(c => c.id === li.categoryId).name : null,
              categories: li.categories
            };
          })
        } : null
      };
    });
  }
);

export const getTariffs = createSelector(
  _getTariffs,
  (tariffs) => {
    return tariffs.reduce((acc, curr) => {

      if (acc[curr.entity.supplyType]) {
        acc[curr.entity.supplyType].push(getTariff(curr));
      } else {
        acc[curr.entity.supplyType] = [getTariff(curr)];
      }
      return acc;
    }, {});
  }
);

