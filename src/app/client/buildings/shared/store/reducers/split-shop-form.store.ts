import {
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
  setValue,
  updateArray,
  updateGroup,
  validate
} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';
import {required} from 'ngrx-forms/validation';

import {BuildingShopViewModel} from '../../models/buildings.model';

import * as shopActions from '../actions/shop.actions';

export interface ShopFormValue {
  name: string;
  area: number;
  tenantName: string;
  floor: number | null;
}

export interface FormValue {
  shops: ShopFormValue[];
  numberOptions: number[];
}

export const INIT_DEFAULT_STATE = {
  shops: new Array(2).fill({
    name: '',
    area: 0,
    tenantName: '',
    floor: null
  }),
  numberOptions: Array.from(Array(9), (_, index) => index + 2)
};

export const FORM_ID = 'splitShop';

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

export interface State {
  formState: FormGroupState<FormValue>;
  shop: BuildingShopViewModel;
}

const validateAndUpdateForm = updateGroup<FormValue>({
  shops: updateArray<ShopFormValue>(
    updateGroup<ShopFormValue>({
      name: validate(required),
      area: validate(required)
    })
  )
});

const reducers = combineReducers<State, any>({
  formState(state = InitState, action: shopActions.Action) {
    state = formGroupReducer(state, action);
    switch (action.type) {
      case shopActions.CHANGE_SHOPS_NUMBER: {
        const shops = new Array(action.payload).fill({
          name: '',
          area: 0,
          tenantName: '',
          floor: null
        });
        const s = {...state.value, shops: shops};
        state = setValue(state, s);
        break;
      }

      case shopActions.REMOVE_SHOP: {
        const shops = state.value.shops.filter((_, idx) => idx !== action.payload);
        const s = {...state.value, shops: shops};
        state = setValue(state, s);
        break;
      }
    }
    return validateAndUpdateForm(state);
  },
  shop(state: BuildingShopViewModel = null, action: shopActions.Action) {
    switch (action.type) {
      case shopActions.SET_SHOP:
        return action.payload;

      default:
        return state;
    }
  }
});

export function reducer(state, action: Action) {
  return reducers(state, action);
}

export const getFormState = (state: State) => state.formState;
export const getShop = (state: State) => state.shop;

