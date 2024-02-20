import {TariffCategoryViewModel} from './../../../../shared/models/tariff-category.model';
import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {TariffCategoriesService} from 'app/shared/tariffs';
import * as supplierStore from '../store/reducers';
import * as selectors from '../store/selectors';
import * as tariffCategoriesActions from 'app/shared/tariffs/store/actions/tariff-categories.actions';
import {
  EquipmentAttributeViewModel,
  EquipmentComboSettingsViewModel,
  LogicalOperators,
  SupplyType,
  TariffCategoryRuleViewModel
} from '@models';


const featureName = 'supplier';

@Injectable()
export class SupplierTariffCategoriesService extends TariffCategoriesService {

  constructor(private store: Store<supplierStore.State>) {
    super();
  }

  getEquipmentAttributes(): Observable<EquipmentAttributeViewModel[]> {
    return this.store.pipe(select(selectors.getAttributes));
  }

  getEquipmentAttributesComoboSettings(): Observable<{ [key: string]: EquipmentComboSettingsViewModel[] }> {
    return this.store.pipe(select(selectors.getAttributesComboValues));
  }

  getSupplyTypes(): Observable<SupplyType[]> {
    return this.store.pipe(select(selectors.getSuppliersSupplyTypes));
  }

  tariffCategoryAddRule(payload: { categoryId: string; groupId: string; ruleId: string; }) {
    this.store.dispatch(new tariffCategoriesActions.TariffCategoryAddNewRule(featureName, payload));
  }

  tariffCategoryChangeRule(payload: { categoryId: string; groupId: string; rule: TariffCategoryRuleViewModel; }): void {
    this.store.dispatch(new tariffCategoriesActions.TariffCategoryChangeRule(featureName, payload));
  }

  tariffCategoryChangeGroupRelationship(payload: { categoryId: string; groupId: string; operator: LogicalOperators; }): void {
    this.store.dispatch(new tariffCategoriesActions.TariffCategorySetGroupLogicalOperator(featureName, payload));
  }

  tariffCategoryChangeRuleRelationship(
    payload: { categoryId: string; groupId: string; ruleId: string; operator: LogicalOperators; }): void {
    this.store.dispatch(new tariffCategoriesActions.TariffCategorySetRuleLogicalOperator(featureName, payload));
  }

  tariffCategoryDeleteRule(payload: { categoryId: string; groupId: string; ruleId: string; }): void {
    this.store.dispatch(new tariffCategoriesActions.TariffCategoryDeleteRule(featureName, payload));
  }

  tariffCategoryAddGroup(payload: { categoryId: string; groupId: string; }): void {
    this.store.dispatch(new tariffCategoriesActions.TariffCategoryAddNewGroup(featureName, payload));
  }

  tariffCategoryAddCategory(perVersion: boolean) {
    this.store.dispatch(perVersion
      ? new tariffCategoriesActions.TariffCategoryAddForVersion(featureName)
      : new tariffCategoriesActions.TariffCategoryAdd(featureName, [new TariffCategoryViewModel(null)]));
  }

  tariffCategoryDeleteCategory(categoryIndex: number) {
    this.store.dispatch(new tariffCategoriesActions.TariffCategoryDelete(featureName, categoryIndex));
  }

  tariffCategoryChangeCategorySupplyType(payload: { categoryId: string; supplyType: number; }) {
    this.store.dispatch(new tariffCategoriesActions.TariffCategoryChangeCategorySupplyType(featureName, payload));
  }

  tariffCategoryResetRule(payload: { categoryId: string; }) {
    this.store.dispatch(new tariffCategoriesActions.TariffCategoryResetRule(featureName, payload));
  }

}
