import {OrderVersion} from '@models';
import {sortRule} from '@shared-helpers';
import {createSelector, MemoizedSelector} from '@ngrx/store';
import * as tariffVersionsStore from '../reducers/tariff-versions.store';

const sortTariffVersions = (tariffVersions: any[], order: number, valueOrder: string) => {
  tariffVersions = [...tariffVersions];
  switch (order) {
    case OrderVersion.ValuesAsc:
      return tariffVersions.sort((a, b) => sortRule(a[valueOrder], b[valueOrder]));
    case OrderVersion.ValuesDesc:
      return tariffVersions.sort((a, b) => sortRule(b[valueOrder], a[valueOrder]));
    case OrderVersion.CreatedAsc:
      return tariffVersions.sort((a, b) => sortRule(a.createdOn, b.createdOn) || sortByMinorVersion(a, b));
    case OrderVersion.CreatedDesc:
      return tariffVersions.sort((a, b) => sortRule(b.createdOn, a.createdOn) || sortByMinorVersion(b, a));
    case OrderVersion.CreatedByAsc:
      return tariffVersions.sort((a, b) => sortRule(a.createdByUser.fullName, b.createdByUser.fullName) || sortByMinorVersion(a, b));
    case OrderVersion.CreatedByDesc:
      return tariffVersions.sort((a, b) => sortRule(b.createdByUser.fullName, a.createdByUser.fullName) || sortByMinorVersion(b, a));
    case OrderVersion.UpdatedAsc:
      return tariffVersions.sort((a, b) => sortRule(a.updatedOn, b.updatedOn) || sortByMinorVersion(a, b));
    case OrderVersion.UpdatedDesc:
      return tariffVersions.sort((a, b) => sortRule(b.updatedOn, a.updatedOn) || sortByMinorVersion(b, a));
    case OrderVersion.UpdatedByAsc:
      return tariffVersions.sort((a, b) => sortRule(a.updatedByUser.fullName, b.updatedByUser.fullName) || sortByMinorVersion(a, b));
    case OrderVersion.UpdatedByDesc:
      return tariffVersions.sort((a, b) => sortRule(b.updatedByUser.fullName, a.updatedByUser.fullName) || sortByMinorVersion(b, a));
    case OrderVersion.IsActiveAsc:
      return tariffVersions.sort((a, b) => sortRule(a.isActual, b.isActual) || sortByMinorVersion(a, b));
    case OrderVersion.IsActiveDesc:
      return tariffVersions.sort((a, b) => sortRule(b.isActual, a.isActual) || sortByMinorVersion(b, a));
    case OrderVersion.StartDateAsc:
      return tariffVersions.sort((a, b) => sortRule(a.versionDate, b.versionDate) || sortByMinorVersion(a, b));
    case OrderVersion.StartDateDesc:
      return tariffVersions.sort((a, b) => sortRule(b.versionDate, a.versionDate) || sortByMinorVersion(b, a));
    default:
      return tariffVersions;
  }
};

const sortByMinorVersion = (version, version2) => {
  return version.minorVersion - version2.minorVersion;
}

export const getTariffVersionsSelectors = (
  getTariffVersionsState: MemoizedSelector<Object, tariffVersionsStore.State>
) => {

  const _getTariffValuesVersions = createSelector(
    getTariffVersionsState,
    state => state.tariffValuesVersions
  );
  const _getTariffVersions = createSelector(
    getTariffVersionsState,
    state => state.tariffVersions
  );

  const _getTariffSubVersions = createSelector(
    getTariffVersionsState,
    state => state.tariffSubVersions
  );

  const getTariffVersionsOrder = createSelector(
    getTariffVersionsState,
    state => state.tariffVersionsOrder
  );

  const getTariffSubVersionsOrder = createSelector(
    getTariffVersionsState,
    state => state.tariffSubVersionsOrder
  );

  const getTariffValuesOrder = createSelector(
    getTariffVersionsState,
    state => state.tariffValuesVersionsOrder
  );

  const getTariffVersionsSorted = createSelector(
    _getTariffVersions,
    getTariffVersionsOrder,
    (versions, order) => {
      return sortTariffVersions(versions, order, 'majorVersion');
    }
  );

  const getTariffSubVersionsSorted = createSelector(
    _getTariffSubVersions,
    getTariffSubVersionsOrder,
    (versions, order) => {
      return sortTariffVersions(versions, order, 'minorVersion');
    }
  );

  const getPreviousSubVersion = createSelector(
    _getTariffSubVersions,
    (versions) => {
      const result = versions.filter(item => !item.isActual).sort((a, b) => a.minorVersion - b.minorVersion);

      return result.length ? result[0] : null;
    }
  );

  const getTariffValuesSorted = createSelector(
    _getTariffValuesVersions,
    getTariffValuesOrder,
    (versions, order) => {
      return sortTariffVersions(versions, order, 'majorVersion');
    }
  );

  return {
    getTariffVersionsSorted,
    getTariffSubVersionsSorted,
    getTariffVersionsOrder,
    getTariffSubVersionsOrder,
    getTariffValuesOrder,
    getTariffValuesSorted,
    getPreviousSubVersion
  };
};
