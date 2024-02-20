import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {BehaviorSubject, Observable} from 'rxjs';

import * as buildingTariffStore from '../store/reducers';
import * as buildingTariffSelectors from '../store/selectors';

import * as tariffCategoriesActions from 'app/shared/tariffs/store/actions/tariff-categories.actions';
import {TariffCategoriesService} from 'app/shared/tariffs/category-items/tariff-categories.service';
import {
  EquipmentAttributeViewModel,
  EquipmentComboSettingsViewModel,
  LogicalOperators,
  SupplyType,
  TariffCategoryRuleViewModel,
  TariffCategoryViewModel
} from '@models';

@Injectable()
export class BuildingTariffCategoriesService extends TariffCategoriesService {

  supplyTypes = new BehaviorSubject([SupplyType.Electricity, SupplyType.Water, SupplyType.Gas, SupplyType.Sewerage, SupplyType.AdHoc]);

  constructor(private store: Store<buildingTariffStore.State>) {
    super();
  }

  getEquipmentAttributes(): Observable<EquipmentAttributeViewModel[]> {
    return this.store.pipe(select(buildingTariffSelectors.getAttributes));
  }

  getEquipmentAttributesComoboSettings(): Observable<{ [key: string]: EquipmentComboSettingsViewModel[] }> {
    return this.store.pipe(select(buildingTariffSelectors.getAttributesComboValues));
  }

  getSupplyTypes(): Observable<SupplyType[]> {
    return this.supplyTypes.asObservable();
  }

  tariffCategoryAddRule(payload: { categoryId: string; groupId: string; ruleId: string; }) {
    this.store.dispatch(new tariffCategoriesActions.TariffCategoryAddNewRule(buildingTariffStore.featureName, payload));
  }

  tariffCategoryChangeRule(payload: { categoryId: string; groupId: string; rule: TariffCategoryRuleViewModel; }): void {
    this.store.dispatch(new tariffCategoriesActions.TariffCategoryChangeRule(buildingTariffStore.featureName, payload));
  }

  tariffCategoryChangeGroupRelationship(payload: { categoryId: string; groupId: string; operator: LogicalOperators; }): void {
    this.store.dispatch(new tariffCategoriesActions.TariffCategorySetGroupLogicalOperator(buildingTariffStore.featureName, payload));
  }

  tariffCategoryChangeRuleRelationship(
    payload: { categoryId: string; groupId: string; ruleId: string; operator: LogicalOperators; }): void {
    this.store.dispatch(new tariffCategoriesActions.TariffCategorySetRuleLogicalOperator(buildingTariffStore.featureName, payload));
  }

  tariffCategoryDeleteRule(payload: { categoryId: string; groupId: string; ruleId: string; }): void {
    this.store.dispatch(new tariffCategoriesActions.TariffCategoryDeleteRule(buildingTariffStore.featureName, payload));
  }

  tariffCategoryAddGroup(payload: { categoryId: string; groupId: string; }): void {
    this.store.dispatch(new tariffCategoriesActions.TariffCategoryAddNewGroup(buildingTariffStore.featureName, payload));
  }

  tariffCategoryAddCategory(perVersion: boolean) {
    this.store.dispatch(perVersion
      ? new tariffCategoriesActions.TariffCategoryAddForVersion(buildingTariffStore.featureName)
      : new tariffCategoriesActions.TariffCategoryAdd(buildingTariffStore.featureName, [new TariffCategoryViewModel(null)]));
  }

  tariffCategoryDeleteCategory(categoryIndex: number) {
    this.store.dispatch(new tariffCategoriesActions.TariffCategoryDelete(buildingTariffStore.featureName, categoryIndex));
  }

  tariffCategoryChangeCategorySupplyType(payload: { categoryId: string; supplyType: number; }) {
    this.store.dispatch(new tariffCategoriesActions.TariffCategoryChangeCategorySupplyType(buildingTariffStore.featureName, payload));
  }

  tariffCategoryResetRule(payload: { categoryId: string}) {
    this.store.dispatch(new tariffCategoriesActions.TariffCategoryResetRule(buildingTariffStore.featureName, payload));
  }
}
