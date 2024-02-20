import {ActionReducer, combineReducers, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';

import {State as ProfileStore} from './profiles.store';
import * as fromAddNewProfileForm from './add-new-profile-form.store';
import * as fromShopGeneralInfo from './shop-detail-reducers/general-info.store';
import * as fromShopAllocatedEquipment from './shop-detail-reducers/allocated-equipment.store';
import * as fromShopCosts from './shop-detail-reducers/costs.store';

import * as fromProfiles from '../../profiles/store/reducers/profiles.reducer'

import * as fromGeneralInfoForm from '../../settings/store/reducers/general-info-form.reducer';
import * as fromChangePasswordForm from './change-password-form.store';

/**
 * Tenant store
 */
export interface State {
  profiles: ProfileStore;
  addNewProfileForm: fromAddNewProfileForm.State;
  shopGeneralInfo: fromShopGeneralInfo.State;
  shopAllocatedEquipment: fromShopAllocatedEquipment.State;
  shopCosts: fromShopCosts.State;
  generalInfoForm: fromGeneralInfoForm.State;
  changePasswordForm: fromChangePasswordForm.State;
}

export const reducers = combineReducers<State, any>({
  profiles: fromProfiles.reducer,
  addNewProfileForm: fromAddNewProfileForm.reducer,
  shopGeneralInfo: fromShopGeneralInfo.reducer,
  shopAllocatedEquipment: fromShopAllocatedEquipment.reducer,
  shopCosts: fromShopCosts.reducer,
  generalInfoForm: fromGeneralInfoForm.reducer,
  changePasswordForm: fromChangePasswordForm.reducer
});


export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = [logger];

const _getStateSettings = createFeatureSelector<State>('tenantUserSettings');
const _getState = createFeatureSelector<State>('tenantProfiles');

export const getProfilesState = createSelector(
  _getState,
  state => state.profiles
);

export const getAddNewProfileFormState = createSelector(
  _getState,
  state => state.addNewProfileForm
);

export const getShopGeneralInfoState = createSelector(
  _getState,
  state => state.shopGeneralInfo
);

export const getShopAllocatedEquipmentState = createSelector(
  _getState,
  state => state.shopAllocatedEquipment
);

export const getShopCostsState = createSelector(
  _getState,
  state => state.shopCosts
);

export const getGeneralInfoFormState = createSelector(
  _getState,
  state => state.generalInfoForm
);

export const getChangePasswordFormState = createSelector(
  _getState,
  state => state.changePasswordForm
);
